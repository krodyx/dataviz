// Generated by CoffeeScript 1.10.0
var API_REFS_FORMAT, DEBUG, DEMO_HASH, app, d, debug, getDecendants, render,
  slice = [].slice;

DEMO_HASH = 'Qmb1nMs5REHEf97RX1RZ5wDKijKsNB3fP5A6Bj5XMdcgB7';

DEBUG = true;

API_REFS_FORMAT = encodeURIComponent('<src> <dst> <linkname>');

app = function() {
  var hash;
  hash = window.location.hash.slice(1);
  debug(hash);
  if (hash.length > 0) {
    return render(hash);
  } else {
    window.location.hash = '#' + DEMO_HASH;
    return window.location.reload();
  }
};

render = function(hash) {
  var apiPath;
  apiPath = "/api/v0/refs?arg=" + hash + "&recursive&format=" + API_REFS_FORMAT;
  debug(apiPath);
  return d3.xhr(apiPath, function(error, xhr) {
    var children, data, datum, dst, i, len, line, lines, linkname, ref1, src, tree;
    data = xhr.responseText;
    tree = {};
    lines = data.split("\n");
    for (i = 0, len = lines.length; i < len; i++) {
      line = lines[i];
      if (!line.trim()) {
        continue;
      }
      datum = JSON.parse(line);
      ref1 = datum.Ref.split(' '), src = ref1[0], dst = ref1[1], linkname = ref1[2];
      if (src && dst && linkname) {
        if (tree[src] == null) {
          tree[src] = [];
        }
        tree[src].push({
          Hash: dst,
          Name: linkname
        });
      }
    }
    children = getDecendants(hash, tree);
    this.root = {
      children: children
    };
    this.root.x0 = h / 2;
    this.root.y0 = 0;
    this.root.children.forEach(toggleAll);
    return update(this.root);
  });
};

getDecendants = function(ref, dict) {
  var child, children, decendants, i, len;
  if (!((ref != null) && (dict != null))) {
    throw new Error;
  }
  children = dict[ref];
  if (children != null) {
    for (i = 0, len = children.length; i < len; i++) {
      child = children[i];
      if (child.Hash == null) {
        throw new Error;
      }
      decendants = getDecendants(child.Hash, dict);
      if (decendants != null) {
        child.children = decendants;
      }
    }
    return children;
  }
};

d = debug = function() {
  var args;
  args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
  if (DEBUG) {
    return console.debug.apply(console, args);
  }
};

app();
