var Edge = function (source, target, capacity) {
  this.source = source;
  this.target = target;
  this.capacity = capacity;
  this.flow = capacity;
};

var FlowNetwork = function () {
  this.edges = {};
};

FlowNetwork.prototype.getEdges = function () {
  return this.edges;
};

FlowNetwork.prototype.addEdge = function (source, target, capacity) {
  if (source == target) return;

  var edge = new Edge(source, target, capacity);
  var reverseEdge = new Edge(target, source, 0);

  if (this.edges[source] === undefined) this.edges[source] = {};
  if (this.edges[target] === undefined) this.edges[target] = {};

  this.edges[source][target] = edge;

  if (!this.isExistEdge(target, source)) {
    this.edges[target][source] = reverseEdge;
  }
};

FlowNetwork.prototype.isExistEdge = function (source, target) {
  return !!this.edges[source][target];

};

FlowNetwork.prototype.isExistVertex = function (vertex) {
  var nodes = Object.keys(this.edges);
  return nodes.indexOf(vertex) !== -1;
};

FlowNetwork.prototype.findMaxFlowFulkerson = function (source, sink, paths) {
  paths = paths || [];
  var maxFlow = 0;
  var parent = {};
  while (this.bfs(source, sink, parent)) {
    var flow = Number.MAX_VALUE;
    var curr = sink;
    var path = [];
    while (curr != source) {
      path.push(curr);
      var prev = parent[curr];
      flow = Math.min(flow, this.edges[prev][curr].flow);
      curr = prev;
    }
    path.push(source);
    paths.push({
      nodes: path.reverse(),
      flow: flow
    });

    curr = sink;
    while (curr != source) {
      prev = parent[curr];
      this.edges[prev][curr].flow -= flow;
      this.edges[curr][prev].flow += flow;
      curr = prev;
    }

    maxFlow += flow;
  }
  return maxFlow;
};

FlowNetwork.prototype.bfs = function (source, target, parent) {
  var queue = [];
  var visited = [];
  queue.push(source);
  visited.push(source);
  while (queue.length) {
    var u = queue.shift();
    var keys = Object.keys(this.edges[u]);
    for (var i = 0; i < keys.length; i++) {
      var v = keys[i];
      if (this.edges[u][v].flow > 0 && visited.indexOf(v) === -1) {
        queue.push(v);
        parent[v] = u;
        visited.push(v);
      }
    }
  }
  return visited.indexOf(target) !== -1;
};
