#!/bin/bash

set -x

# Version store

naive_version="v$(curl -s https://data.jsdelivr.com/v1/package/gh/klzgrad/naiveproxy | sed -n 4p | tr -d ',"' | awk '{print $1}')"

#########################

version_name="${1}_version"

eval "export VERSION=\$$version_name"
