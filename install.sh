#!/usr/bin/env bash
# Stop if it was running
systemctl stop mtgcardfinder
# Set up mtgcardfinder as a service
cp mtgcardfinder.service /etc/systemd/system
systemctl daemon-reload
# update npm modules
npm install --production
# Start mtgcardfinder
systemctl start mtgcardfinder
