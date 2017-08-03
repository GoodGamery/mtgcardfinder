#!/usr/bin/env bash
# Stop if it was running
systemctl stop mtgcardfinder
# Set up mtgcardfinder as a service
cp mtgcardfinder.service /etc/systemd/system
systemctl daemon-reload
# Start mtgcardfinder
systemctl start mtgcardfinder
