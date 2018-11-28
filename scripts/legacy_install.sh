function depends {
  if type mysql >/dev/null 2>&1; then
    echo "✓ Found $1."
  else
    echo "✕ Failed to find $1."
    echo "Install an appropriate version of $1 before proceeding." 
    exit 1
  fi
}

# End script if we aren't in the correct directory
if [ ! -d ".git" ]; then 
  echo "Please run this script in your top level directory."
  exit 1
fi

echo "############"
echo "DEPENDENCIES"
echo "############"
echo

# System-wide dependencies
depends MySQL
depends yarn
depends pip 
depends virtualenv

echo

# Ask if the user has installed lxml 
read -p "Is the lxml parser installed on your system [Y/n]? " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ && ! $REPLY = "" ]]; then
  echo "See https://lxml.de/installation.html#installation for more information."
  exit 1
fi

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo
fi
echo "#####"
echo "MYSQL"
echo "#####"
echo

# Configure MySQL secrets 
read -p "Enter the password for MySQL user 'root': " 
echo "Saving password to ./backend/secrets.py ..."
echo "password = '$REPLY'" > backend/secrets.py

# Create MySQL classes database 
echo "Creating classes database ... (you will have to enter your password again)"
echo "create database classes;" | mysql -u root -p

echo
echo "#######"
echo "MODULES"
echo "#######"
echo

# Virtual environment setup
if [ ! -d "venv" ]; then
  echo "Preparing new virtual environment ..."
  virtualenv venv 
fi

# Virtual environment activation
echo "Activating virtual environment ..."
source venv/bin/activate

# Frontend modules 
echo "Installing frontend modules ..."
cd frontend && yarn install && cd ..

# Backend modules
echo "Installing backend modules ..."
cd backend && pip install -r requirements.txt && cd ..

echo
echo "########"
echo "SCRAPING"
echo "########"
echo

# Prompt before running final command
echo "Running command \`python3 backend/datautil/webreg_master.py\` ..."
read -p "Would you like to proceed? [Y/n] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ || $REPLY = "" ]]; then
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo
  fi
  [[ ":$PYTHONPATH:" != *":$(pwd)/backend:"* ]] && export PYTHONPATH="$(pwd)/backend:${PYTHONPATH}"
  python3 backend/datautil/webreg_master.py
else
  exit 1
fi
