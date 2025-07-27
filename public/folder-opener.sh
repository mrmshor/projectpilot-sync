#!/bin/bash
# Mac/Linux Folder Opener Script
# Usage: ./folder-opener.sh "/path/to/folder"

if [ -z "$1" ]; then
    echo "Please provide a folder path as argument"
    echo "Usage: ./folder-opener.sh \"/path/to/folder\""
    exit 1
fi

folder_path="$1"

# Check if folder exists
if [ ! -d "$folder_path" ]; then
    echo "Folder does not exist: $folder_path"
    exit 1
fi

# Detect OS and open accordingly
if [[ "$OSTYPE" == "darwin"* ]]; then
    # Mac OS
    open "$folder_path"
    echo "Folder opened in Finder: $folder_path"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v xdg-open &> /dev/null; then
        xdg-open "$folder_path"
    elif command -v nautilus &> /dev/null; then
        nautilus "$folder_path"
    elif command -v dolphin &> /dev/null; then
        dolphin "$folder_path"
    else
        echo "No file manager found. Folder path: $folder_path"
        exit 1
    fi
    echo "Folder opened: $folder_path"
else
    echo "Unsupported OS: $OSTYPE"
    exit 1
fi