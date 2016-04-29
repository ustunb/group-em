function ClusterLayout(svg) {

var layout = this;

var CIRCLE_RADIUS = 32;    // Radius of a single node circle
var CLUSTER_WIDTH = 88;    // Minimum diameter of cluster shell
var SPLIT_DISTANCE = 176;  // Distance for splitting apart
var JOIN_DISTANCE = 88;    // Distance for joining together

var state = {};

function clear() {
  if (state.force) {
    state.force.stop();
  }
  window.state = state = {
    nodes_by_id: {},     // By node id
    clusters_by_id: {},  // By cluster id
    links_by_key: {},    // By cluster_id + target_id + source_id
    next_cluster_id: 1,
    clusters: [],
    nodes: [],
    links: [],
    joins: [],
    hidden_clusters: 0,
    reveal_timer: null,
    rebuilding: false,
    svg: d3.select(svg),
    force: d3.layout.force().charge(-400).linkDistance(60).gravity(0),
    clustersel: null,
    zoomsel: null,
    linksel: null,
    joinsel: null,
    nodesel: null,
    linkdrag: null,
    nodedrag: null,
    zoom: null,
  };
  state.svg.selectAll('*').remove();
  state.zoomsel =
    state.svg.insert('g').classed('zooms', true);
  state.joinsel =
    state.zoomsel.insert('g').classed('joins', true).selectAll('line');
  state.linksel =
    state.zoomsel.insert('g').classed('links', true).selectAll('line');
  state.nodesel =
    state.zoomsel.insert('g').classed('nodes', true).selectAll('g');
  // Enable zoom behavior without panning.
  state.zoom = d3.behavior.zoom().scaleExtent([0.3,7.0]);
  state.zoom.on('zoom', function() {
    state.zoomsel.attr("transform",
        "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  });
  state.svg.call(state.zoom).on('mousedown.zoom', null);
  state.svg.on('mousedown.clustersel', function() { updateclustersel(null); });
  resize();
  state.force.on('tick', tick);
}
clear();
layout.clear = clear;

function concealClusters() {
  state.hidden_clusters = state.clusters.length;
  rebuild();
}
layout.concealClusters = concealClusters;

function startReveal(delay) {
  delay = delay || 1000;
  clearTimeout(state.reveal_timer);
  state.reveal_timer = setTimeout(continueReveal, delay);
  // TODO: eliminate links, and animate notes
  function continueReveal() {
    if (state.hidden_clusters > 0) {
      state.hidden_clusters -= 1;
      rebuild();
      state.reveal_timer = setTimeout(continueReveal, delay);
    } else {
      state.reveal_timer = null;
    }
  }
}
layout.startReveal = startReveal;


function endReveal() {
  clearTimeout(state.reveal_timer);
  state.reveal_timer = null;
  state.hidden_clusters = 0;
  rebuild();
}
layout.endReveal = endReveal;


layout.addNode = function addNode(id, obj) {
  var node = {id: id, ndata: obj, cluster: null};
  state.nodes.push(node);
  state.nodes_by_id[id] = node;
  invalidate();
}

layout.addCluster = function addCluster(node_id_list) {
  var id = state.next_cluster_id++;
  var cluster = { id: id, nodes: [] }
  node_id_list.map(function(sid) {
    addNodeToCluster(state.nodes_by_id[sid], cluster);
  });
  state.clusters.push(cluster);
  state.clusters_by_id[id] = cluster;
  invalidate();
}

/* Returns an object representing the selected cluster, if any. */
layout.getSelectedCluster = function getSelectedCluster() {
  if (!state.clustersel) { return { id: -1, nodes: [] }; }
  return {
    id: repId(state.clustersel),
    nodes: _.map(state.clustersel.nodes, function(n) { return n.id; })
  };
};

function updateclustersel(cluster) {
  if (d3.event) {
    var se = d3.event.sourceEvent || d3.event;
    if (se.handledClustersel) {
      return;
    }
    se.handledClustersel = true;
  }
  state.clustersel = cluster;
  state.linksel.classed('clustersel', function(d) {
    return d.cluster === state.clustersel;
  });
  if (cluster == null) {
    $(layout).trigger({
      type: 'clustersel',
      id: -1,
      nodes: []
    });
  } else {
    $(layout).trigger({
      type: 'clustersel',
      id: repId(cluster),
      nodes: _.map(cluster.nodes, function(n) { return n.id; })
    });
  }
}

function repId(cluster) {
  if (cluster.nodes.length === 0) {
    return -1;
  }
  return cluster.nodes.reduce(function(a, b) {
    return (a.id < b.id) ? a : b;
  }).id;
}

// Returns all the nodes in the same cluster as the given node, but not
// including the node itself.
function nodeSiblings(node) {
  if (!node.cluster) {
    return [];
  }
  return node.cluster.nodes.filter(function(item) {
    return item !== node;
  });
}

function removeNodeFromCluster(node) {
  if (!node.cluster) {
    return;
  }
  var clusterRep = repId(node.cluster);
  node.cluster.nodes = nodeSiblings(node);
  node.cluster = null;
  invalidate();
}

function addNodeToCluster(node, cluster) {
  if (node.cluster === cluster) {
    // Nothing to do.
    return;
  }
  // Enforce invariant: node must be in at most one cluster.
  removeNodeFromCluster(node);
  cluster.nodes.push(node);
  node.cluster = cluster;
  invalidate();
}

function invalidate() {
  if (!state.rebuilding) {
    state.rebuilding = true;
    setTimeout(function() {
      state.rebuilding = false;
      rebuild();
    }, 0);
  }
}

function rebuild() {
  // Rebuild the state.links array, reusing any links that
  // were already existing.
  var new_links = [];
  for (var j = 0; j < state.clusters.length - state.hidden_clusters; ++j) {
    var cluster = state.clusters[j]
    for (var k = 1; k < cluster.nodes.length; ++k) {
      var target = cluster.nodes[k];
      for (var m = 0; m < k; ++m) {
        var source = cluster.nodes[m];
        var key = [cluster.id, target.id, source.id].join(':');
        if (state.links_by_key.hasOwnProperty(key)) {
          new_links.push(state.links_by_key[key]);
        } else {
          new_links.push({
            key: key,
            cluster: cluster,
            source: source,
            target: target
          });
        }
      }
    }
  }
  // Rebuild index.
  state.links_by_key = {};
  for (j = 0; j < new_links.length; ++j) {
    state.links_by_key[new_links[j].key] = new_links[j];
  }
  state.links = new_links;
  // TODO: go through clusters finding empty ones, and fire events
  // for eliminated clusters.
  // TODO: rebuild D3 stuff.
  state.force.links(state.links);
  state.force.nodes(state.nodes);
  start();
}

// http://stackoverflow.com/questions/28102089/simple-graph-of-nodes-and-links-without-using-force-layout
function start() {
  state.linksel = state.linksel
    .data(state.force.links(), function(d) { return d.key });
  state.linksel.enter().insert('line')
    .attr({
      'stroke-width': CLUSTER_WIDTH,
      class: function(d) {
        var result = 'link cluster_' + d.cluster.id;
        if (d.cluster === state.clustersel) {
          result += ' clustersel';
        }
        return result;
      }
    })
    .call(linkdrag)
    .on('mousedown.clustersel', function(d) {
      updateclustersel(d.cluster);
    });
  state.linksel.exit().remove();

  state.nodesel = state.nodesel
    .data(state.force.nodes(), function(d) { return d.id; } );

  var ins = state.nodesel.enter().insert('g').classed('node', true).attr({
    'id': function(d) {
      return 'node_' + d.id;
    }
  });
  var radius = CIRCLE_RADIUS;
  ins.append('circle').attr({
    cx: 0, cy: 0, r: radius
  });
  ins.append('text').attr({
    'alignment-baseline': 'middle',
    'text-anchor': 'middle',
    y: 1
  }).text(function(d) {
    return '' + d.ndata;
  }).style({
    font: 'Arial',
    'font-size': function(d) {
      var t = '' + d.ndata;
      return Math.min(20, (2 * radius - 8) /
                      this.getComputedTextLength() * 16) + "px"; }
  });
  ins.call(nodedrag);

  state.nodesel.exit().remove();
  state.force.start();
}

d3.select(window).on('resize', resize);
function resize() {
  state.force.size([
    parseFloat(state.svg.style('width')),
    parseFloat(state.svg.style('height'))
  ]);
}

// Position objects according to their coordinates.
var gravity = 0.08;
function tick() {
  var size = state.force.size(),
      alpha = state.force.alpha(),
      k = alpha * gravity;
  if (k) {
    for (var j = 0; j < state.nodes.length; ++j) {
      var node = state.nodes[j];
      var x = size[0] / 2;
      var y = size[1] / 2;
      var boost = 1;
      // Custom gravity: each cluster has its own gravitational center.
      if (node.cluster && !isNaN(node.cluster.x) && !isNaN(node.cluster.y)) {
        x = node.cluster.x;
        y = node.cluster.y;
        boost = 2;
      }
      var scale = node.cluster && node.cluster.nodes.length || 1;
      node.x += (x - node.x) * k * boost;
      node.y += (y - node.y) * k * boost;
    }
  }
  state.linksel.attr('x1', function(d) { return d.source.x; });
  state.linksel.attr('y1', function(d) { return d.source.y; });
  state.linksel.attr('x2', function(d) { return d.target.x; });
  state.linksel.attr('y2', function(d) { return d.target.y; });
  state.joinsel.attr('x1', function(d) { return d.source.x; });
  state.joinsel.attr('y1', function(d) { return d.source.y; });
  state.joinsel.attr('x2', function(d) { return d.target.x; });
  state.joinsel.attr('y2', function(d) { return d.target.y; });
  state.nodesel.attr('transform', function(d) {
    return 'translate(' + [d.x, d.y] + ')';
  });
}

function initClusterCoords(cluster) {
  if (cluster && !('x' in cluster) && cluster.nodes.length) {
    var ax = 0, ay = 0;
    for (var j = 0; j < cluster.nodes.length; ++j) {
      ax += cluster.nodes[j].x;
      ay += cluster.nodes[j].y;
    }
    ax /= cluster.nodes.length;
    ay /= cluster.nodes.length;
    if (!isNaN(ax) && !isNaN(ay)) {
      cluster.x = ax;
      cluster.y = ay;
    }
  }
}

var fixedAfterDrag = 0;

function distance(a, b) {
  var dx = a.x - b.x, dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function findJoinNode(d) {
  var closest = null;
  state.nodes.map(function(node2) {
    if (node2 === d || node2.cluster && node2.cluster === d.cluster) {
      return;
    }
    if (distance(node2, d) < JOIN_DISTANCE) {
      if (!closest || distance(node2, d) < distance(closest, d)) {
        closest = node2;
      }
    }
  });
  return closest;
}

function nodedrag() {
  if (!state.nodedrag) {
    state.nodedrag = d3.behavior.drag().on('dragstart.cluster', function(d) {
      initClusterCoords(d.cluster);
      d.fixed |= 2 | fixedAfterDrag;
      nodeSiblings(d).map(function(d2) {
        d2.fixed |= 2;
        d2.px = d2.x;
        d2.py = d2.y;
      });
      updateclustersel(d.cluster);
    }).on('drag.cluster', function(d) {
      d.px += d3.event.dx;
      d.py += d3.event.dy;
      var breaking = false;
      var closest = findJoinNode(d);
      if (closest) {
        breaking = true;
        if (!closest.cluster) {
          state.joins = [{source: d, target: closest}];
        } else {
          state.joins = closest.cluster.nodes.map(function(n) {
            return { source: d, target: n };
          });
        }
      } else {
        state.joins = [];
        if (d.cluster) {
          if (d.cluster.nodes.length == 1) {
            d.cluster.x = d.px;
            d.cluster.y = d.py;
          } else {
            var dx = d.cluster.x - d.px, dy = d.cluster.y - d.py;
            breaking = dx * dx + dy * dy > SPLIT_DISTANCE * SPLIT_DISTANCE;
          }
        }
      }
      state.force.resume();
      updatejoins();
      state.linksel.filter(function(link) {
        return link.source === d || link.target === d;
      }).classed('breaking', breaking);
    }).on('dragend.cluster', function(d) {
      var event = null;
      d.fixed &= ~2;
      nodeSiblings(d).map(function(d2) {
        d2.fixed &= ~2;
      });
      var closest = findJoinNode(d);
      var cluster = null;
      if (closest) {
        // Report an event that a node has switched to a different cluster.
        cluster = closest.cluster;
        event = { type: 'join', node: d.id, cluster: repId(cluster) };
        addNodeToCluster(d, closest.cluster);
      } else if (d.cluster && d.cluster.nodes.length > 1) {
        var dx = d.cluster.x - d.px, dy = d.cluster.y - d.py,
            split = dx * dx + dy * dy > SPLIT_DISTANCE * SPLIT_DISTANCE;
        if (split) {
          // Report an event that a node has gone to its own new cluster.
          event = { type: 'join', node: d.id, cluster: null };
          layout.addCluster([d.id]);
          d.cluster.x = d.x;
          d.cluster.y = d.y;
          cluster = d.cluster;
        }
      }
      state.joins = [];
      updatejoins();
      state.svg.selectAll('.breaking').classed('breaking', false);
      // Finally: report events after all UI is done.
      if (event) {
        $(layout).trigger(event);
        updateclustersel(cluster);
      }
    });
  }
  this.call(state.nodedrag);
}

function updatejoins() {
  state.joinsel = state.joinsel.data(state.joins);
  state.joinsel.enter().insert('line').attr({class: 'join'});
  state.joinsel.exit().remove();
}

function linkdrag() {
  if (!state.linkdrag) {
    state.linkdrag = d3.behavior.drag().on('dragstart.cluster', function(d) {
      initClusterCoords(d.cluster);
      d.cluster.nodes.map(function(n) {
        n.fixed |= 2;
      });
    }).on('drag.cluster', function(d) {
      d.cluster.x += d3.event.dx;
      d.cluster.y += d3.event.dy;
      d.cluster.nodes.map(function(n) {
        n.px += d3.event.dx;
        n.py += d3.event.dy;
      });
      state.force.resume();
    }).on('dragend.cluster', function(d) {
      d.cluster.nodes.map(function(n) {
        n.fixed &= ~2;
      });
    });
  }
  this.call(state.linkdrag);
}

}
