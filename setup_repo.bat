@echo off
setlocal
set "SETUP_FAILED="

rem Basic repository setup script for Windows environments.
rem Run this from the repository root: .\setup_repo.bat

if not exist ".git" (
  echo This script must be run from the repository root.
  exit /b 1
)
where /q git
if not errorlevel 1 (
  git rev-parse --git-dir >nul 2>&1
  if errorlevel 1 (
    echo This directory is not recognized as a valid Git repository.
    exit /b 1
  )
) else (
  echo Git not found on PATH; skipping repository validation.
)

echo Setting up repository...

if exist "package.json" (
  echo Detected package.json.
  where /q npm
  if errorlevel 1 (
    echo npm is not available on PATH; skipping Node.js dependency installation.
    set "SETUP_FAILED=1"
  ) else (
    echo Installing Node.js dependencies...
    call npm install
    if errorlevel 1 (
      echo npm install failed; please review the output above.
      set "SETUP_FAILED=1"
    )
  )
) else (
  echo No package.json found; skipping npm install.
)

if exist "requirements.txt" (
  echo Detected requirements.txt.
  where /q python
  if errorlevel 1 (
    echo Python is not available on PATH; skipping Python dependency installation.
    set "SETUP_FAILED=1"
  ) else (
    echo Creating virtual environment and installing Python dependencies...
    if not exist ".venv" (
      python -m venv .venv
      if errorlevel 1 (
        echo Failed to create virtual environment; skipping Python dependency installation.
        set "SETUP_FAILED=1"
        goto :skip_python_install
      )
    )
    if not exist ".venv\Scripts\activate.bat" (
      echo Virtual environment activation script not found; skipping Python dependency installation.
      set "SETUP_FAILED=1"
      goto :skip_python_install
    )
    if not exist ".venv\Scripts\python.exe" (
      echo Virtual environment Python executable not found; skipping Python dependency installation.
      set "SETUP_FAILED=1"
      goto :skip_python_install
    )
    ".venv\Scripts\python.exe" -m pip install --upgrade pip
    if errorlevel 1 (
      echo Failed to upgrade pip; continuing with the existing version.
    )
    ".venv\Scripts\python.exe" -m pip install -r requirements.txt
    if errorlevel 1 (
      echo python -m pip install failed; please review the output above.
      set "SETUP_FAILED=1"
    )
    :skip_python_install
  )
) else (
  echo No requirements.txt found; skipping Python dependency installation.
)

if defined SETUP_FAILED (
  echo Repository setup completed with issues. Please review the messages above.
  endlocal
  exit /b 1
)

echo Repository setup complete.
endlocal
exit /b 0
