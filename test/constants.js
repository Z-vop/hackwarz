

export const GREEN = 0;
export const BLUE = 1;
export const RED = 2;

export const blue_node = {
    id: 1,
    health: 30,
    size: 30,
    power: 3,
    owner: BLUE
}

export const blue_node2 = {
    id: 4,
    health: 60,
    size: 60,
    power: 6,
    owner: BLUE
}

export const green_node = {
    id: 2,
    health: 0,
    size: 40,
    power: 4,
    owner: GREEN
}

export const red_node = {
    id: 3,
    health: 50,
    size: 50,
    power: 5,
    owner: RED
};

export const red_node2 = {
    id: 5,
    health: 30,
    size: 30,
    power: 3,
    owner: RED
};

export const network1 = {
    nodes: [blue_node, blue_node2, green_node, red_node],
    connections: []
};

export const network2 = {
    nodes: [blue_node, blue_node2, green_node, red_node, red_node2],
    connections: [ [1,4], [4,2], [2,3], [3,5] ]
};

