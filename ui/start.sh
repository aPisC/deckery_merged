#! /bin/bash
if [[ ! -d "build" ]]; then 
  yarn build
fi

serve -s build -l 80