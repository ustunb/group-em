window.world = {

  currentroom: 0,

  classrooms: [ 
    {
      classname: "First Period Math",
      students: [
        {
          name: "Alice",
          prefer: [ "Bob" ],
          avoid: [],
          location: null
        },
        {
          name: "Bob",
          prefer: [ ],
          avoid: [ "Alice" ],
          location: null
        },
        {
          name: "Cory",
          prefer: [ ],
          avoid: [ ],
          location: {x: 123, y: 123}
        },
        {
          name: "Dana",
          prefer: [ ],
          avoid: [ "Bob" ],
          location: {x: 523, y: 323}
        }
      ],
      groupsize: 2,
      groups: [
        {
          members: ["Alce", "Bob"],
          location: {x: 523, y: 123 }
        },
        {
          members: ["Cory", "Dana"],
          location: {x: 223, y: 252 }
        }
      ],
    },
  
    {
      classname: "Second Period Math",
      students: [
        {
          name: "Elo",
          prefer: [  ],
          avoid: [],
          location: null
        },
        {
          name: "Fra",
          prefer: [ ],
          avoid: [  ],
          location: null
        },
        {
          name: "Gem",
          prefer: [ ],
          avoid: [ ],
          location: null
        },
        {
          name: "Har",
          prefer: [ ],
          avoid: [  ],
          location: null
        },
        {
          name: "Ira",
          prefer: [ ],
          avoid: [  ],
          location: null
        }
      ],
      groupsize: 3,
      groups: [
        {
          members: ["Elo", "Gem", "Har"],
          location: null
        },
        {
          members: ["Fra", "Ira"],
          location: null
        }
      ]
    }
  ]
}
