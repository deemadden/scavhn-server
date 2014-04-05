#!/bin/bash


echo "loading reference data"
./../tools/mongodb-osx-x86_64-2.4.8/bin/mongo scavs_dev --eval "db.dropDatabase()"
./../tools/mongodb-osx-x86_64-2.4.8/bin/mongoimport --file ../data/reference.json --collection scavs --host localhost --db scavs_dev --jsonArray
./../tools/mongodb-osx-x86_64-2.4.8/bin/mongoimport --file ../data/reference_items.json --collection items --host localhost --db scavs_dev --jsonArray
./../tools/mongodb-osx-x86_64-2.4.8/bin/mongoimport --file ../data/reference_users.json --collection users --host localhost --db scavs_dev --jsonArray

echo "associating items with scavs"
pushd ./dbapp
node bootstrap.js
popd

