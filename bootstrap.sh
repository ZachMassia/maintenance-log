#!/usr/bin/env bash

# Install packages.
sudo apt-get update
sudo apt-get install -y git libsqlite3-dev libssl-dev


# Install NVM.
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash

# This enables NVM without a logout/login.
export NVM_DIR="/home/vagrant/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

# Install and alias.
nvm install 6.3.0
nvm alias default 6.3.0


# Setup ~/bash_profile for PyEnv.
cat >"$HOME/.bash_profile" <<EOL
export path='$HOME/.pyenv/bin:$PATH'
eval '$(pyenv init -)'
EOL

# Install PyEnv.
curl -L https://raw.githubusercontent.com/yyuu/pyenv-installer/master/bin/pyenv-installer | bash

# Load PyEnv right away.
export PATH="$HOME/.pyenv/bin:$PATH"
eval "$(pyenv init -)"

# Install and set default Python version.
pyenv install 3.5.2
pyenv rehash
pyenv global 3.5.2

# Install required Python packages. (NodeJS packages to be installed when ssh-ing in.)
pip install --upgrade pip
pip install -r /vagrant/back-end/requirements.txt
