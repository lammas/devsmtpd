#!/bin/sh
REPO_ROOT=$(cd $(dirname "$0")/..; pwd)
cd "${REPO_ROOT}"
set -e

docker build -t lammas/devsmtpd:latest -t lammas/devsmtpd:1.0.3 -f Dockerfile .
