import os
import argparse
import paramiko
from paramiko import SSHClient
from scp import SCPClient
from dotenv import load_dotenv
import re

parser = argparse.ArgumentParser(description='Run local project on connected Raspberry Pi.')
parser.add_argument("--dirpath", help="path of project to synchronize from content root (WoT/)")
args = parser.parse_args()

#load env variables from .env file
load_dotenv()
host = os.getenv("PI_HOSTNAME")
user = os.getenv("USERNAME")
port = os.getenv("PORT")
passwd = os.getenv("PASSWORD")


ssh = SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy)
ssh.load_system_host_keys()
ssh.connect(host, port, user, passwd)

try:
    stdin, stdout, stderr = ssh.exec_command("ls -al Projects/ | grep {}".format(args.dirpath))
    lines = stdout.readlines()
    if len(lines) != 0:
        stdout = ssh.exec_command('rm -rf Projects/{}'.format(args.dirpath))
    else:
        stdout = ssh.exec_command('mkdir Projects/{}'.format(args.dirpath))
        project_path = args.dirpath
        scp = SCPClient(ssh.get_transport())
        for file in os.listdir(project_path):
            if (file == 'node_modules'):
                continue
            scp.put(os.path.join(project_path, file), recursive=True, remote_path="Projects/{}".format(project_path))
        scp.close()
except Exception as e:
    print(str(e))
