#!/bin/sh
REPO_ROOT=$(cd $(dirname "$0")/..; pwd)
cd "${REPO_ROOT}"
set -e

docker build -t devsmtpd:latest -t devsmtpd:1.0.0 -f Dockerfile .