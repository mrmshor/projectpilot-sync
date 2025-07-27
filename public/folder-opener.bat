@echo off
rem Windows Folder Opener Script
rem Usage: folder-opener.bat "C:\Path\To\Folder"

if "%~1"=="" (
    echo Please provide a folder path as argument
    echo Usage: folder-opener.bat "C:\Path\To\Folder"
    pause
    exit /b 1
)

set "folder_path=%~1"

rem Check if folder exists
if not exist "%folder_path%" (
    echo Folder does not exist: %folder_path%
    pause
    exit /b 1
)

rem Open folder in Windows Explorer
explorer "%folder_path%"

echo Folder opened: %folder_path%