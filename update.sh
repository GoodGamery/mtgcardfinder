#!/usr/bin/env bash
systemctl stop mtgcardfinder
git pull
systemctl start mtgcardfinder
