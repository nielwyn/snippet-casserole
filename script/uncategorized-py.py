import re

input_data = {
    # Example keys, replace with actual data
    "IDS_TOOLTIP_WALLET": "Tooltip to access the Herond Wallet",
    "IDS_ACCNAME_BRAVE_WALLET_BUTTON": "The accessible name for the Herond Wallet bubble."
}

def convert_camel_case_to_readable(s):
    # Insert spaces before uppercase letters and capitalize the first letter of each word
    formatted_string = re.sub(r'([a-z])([A-Z])', r'\1 \2', s)
    formatted_string = formatted_string.replace('_', ' ')  # Handle underscores
    return formatted_string.title()  # Capitalize the first letter of each word

localized_strings = []
for key, value in input_data.items():
    readable_key = convert_camel_case_to_readable(key)
    message_name = f"ids_{readable_key.replace(' ', '').upper()}"
    localized_strings.append(f'  <message name="{message_name}" desc="{value}">{value}</message>')

# Compose the final output
output = "\n".join(localized_strings)

# Print or write the output to a file
print(output)

# with open('localized_strings.xml', 'w') as f:
#     f.write(output)
#     print('Output successfully written to localized_strings.xml')
