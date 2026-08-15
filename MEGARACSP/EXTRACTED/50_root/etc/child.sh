#!/bin/sh

pidtree() {
  for _child in $(ps -o pid --no-headers --ppid $1); do
    echo -n $_child `pidtree $_child` " "
 kill -9 $_child `pidtree $_child`
  done
}

pidtree $1
