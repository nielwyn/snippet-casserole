import os
import re

def trim_prefix(string):
    if "braveWallet" in string: 
        return string.replace("braveWallet", "")
    if "herondWallet" in string: 
        return string.replace("herondWallet", "")

def replace_brave_to_herond(path, old_string, new_string):
    with open(path, "r") as read_file:
        lines = read_file.readlines()
        for index,line in enumerate(lines):
            lines[index] = line.replace(old_string, new_string)
        with open(path, "w") as write_file:
            write_file.writelines(lines)
# replace_brave_to_herond("./test-file.tsx", "braveWalletReset", "herondWalletSomething")

def create_brave_herond_string_dictionary():
    dictionary = {} 
    with open("./script.js", "r") as read_file:
        for line in read_file:
            if "herondWallet" in line:
                matches = re.findall(r"herondWallet\w*", line)
                for match in matches:
                    key = match.replace("herondWallet", "braveWallet")
                    dictionary[key] = match
    return dictionary
brave_herond_string_dictionary= create_brave_herond_string_dictionary()
# print(brave_herond_string_dictionary)

def recursive_for_brave_string():
    for root,dirs,files in os.walk("./"):
        for file in files:
            if file.endswith('.tsx'):
                fullpath = open(os.path.join(root, file),'r')
                for line in fullpath:
                    if "getLocale" in line and "braveWallet" in line:
                        brave_string_list = re.findall(r"braveWallet\w*", line)
                        for brave_string in brave_string_list:
                            if brave_string in brave_herond_string_dictionary:
                                replace_brave_to_herond(os.path.join(root, file), brave_string, brave_herond_string_dictionary[brave_string])
recursive_for_brave_string()

