@echo off
setlocal

rem Basic repository setup script for Windows environments.
rem Run this from the repository root: .\setup_repo.bat

if not exist ".git" (
  echo This script must be run from the repository root.
  exit /b 1
)

echo Setting up repository...

if exist "package.json" (
  echo Detected package.json.
  where npm >nul 2>nul
  if errorlevel 1 (
    echo npm is not available on PATH; skipping Node.js dependency installation.
  ) else (
    echo Installing Node.js dependencies...
    call npm install
  )
) else (
  echo No package.json found; skipping npm install.
)

if exist "requirements.txt" (
  echo Detected requirements.txt.
  where python >nul 2>nul
  if errorlevel 1 (
    echo Python is not available on PATH; skipping Python dependency installation.
  ) else (
    echo Creating virtual environment and installing Python dependencies...
    if not exist ".venv" (
      python -m venv .venv
    )
    if not exist ".venv\Scripts\activate.bat" (
      echo Virtual environment activation script not found; skipping Python dependency installation.
    ) else (
      call .venv\Scripts\activate
      if errorlevel 1 (
        echo Failed to activate virtual environment; skipping Python dependency installation.
      ) else (
        pip install -r requirements.txt
      )
    )
  )
) else (
  echo No requirements.txt found; skipping Python dependency installation.
)

echo Repository setup complete.
endlocal
exit /b 0
