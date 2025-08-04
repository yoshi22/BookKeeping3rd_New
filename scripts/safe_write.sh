#!/bin/bash
# Safe write script to handle file redirection
# Usage: echo "content" | scripts/safe_write.sh filename

if [ $# -ne 1 ]; then
    echo "Usage: $0 <filename>"
    exit 1
fi

cat > "$1"