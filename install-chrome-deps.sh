#!/usr/bin/env bash
set -x

echo "script Updating package lists..."
apt-get update && apt-get install -y wget gnupg

echo "script Installing required libraries..."
apt-get install -y libxss1 libasound2 libnss3 libx11-xcb1 libatk-bridge2.0-0 libgtk-3-0
