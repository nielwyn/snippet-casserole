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

def remove_duplicate():
    with open('./chromium_src/herond/components/herond_wallet/browser/herond_wallet_constants.h', 'r') as read_file:
        array = list()
        id_array = list()
        lines = read_file.readlines()
        for line in lines:
            match = re.findall(r"herondWallet\w*", line)
            id_match = re.findall(r"IDS_HEROND_WALLET_\w*", line)
            # print(match)
            if match: array.append(match[0])
            if id_match: id_array.append(id_match[0])
            # print(array)
        dup_list = [item for item, count in collections.Counter(array).items() if count > 1]
        id_dup_list = [item for item, count in collections.Counter(id_array).items() if count > 1]
        # print(id_dup_list)

        with open('./chromium_src/herond/components/herond_wallet/browser/herond_wallet_constants_test.h', 'w') as write_file:
            commented = list() 
            id_commented = list() 
            for line in lines:
                match = re.findall(r"herondWallet\w*", line)
                id_match = re.findall(r"IDS_HEROND_WALLET_\w*", line)
                # print(id_match)kjj
                if match and match[0] not in commented:
                    write_file.writelines(line)
                    commented.append(match[0])
                    # if id_match: id_commented.append(id_match[0])
                
                if id_match and id_match[0] not in id_commented and not match:
                    write_file.writelines(line)
                    id_commented.append(id_match[0])
