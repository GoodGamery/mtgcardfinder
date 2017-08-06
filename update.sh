#!/usr/bin/env bash
git pull
npm install --production
systemctl restart mtgcardfinder
