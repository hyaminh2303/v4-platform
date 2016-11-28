#!/usr/bin/env bash
docker run  --env SECRET_KEY_BASE=d44139826aaeeec980d0ef389291137138f4728c00f979849e4c966d1a9fa8f044149db9d5eef33f8dd0016c2f565c04143bddd91c61b694628b115f43afc3d3 \
      --env MONGO_DATABASE_NAME=v4-dashboard \
      --env MONGO_HOST=192.168.99.100 \
      --env FRONTEND_URL=http://localhost:8080 \
      --env MAX_RECORD=30 -p 8888:80 --name dashboard \
      git.yoose.com:5000/dashboard-api:1.0.0