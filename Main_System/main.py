import csv
from dicttoxml import dicttoxml
import requests
import random
import string
import json
import msgpack

KEYS = [
    'FirstName',
    'LastName',
    'Email',
    'Birthday',
    'Phone',
    'Address',
    'Country'
]

with open('people.csv', 'r') as f:
    reader = csv.reader(f)

    rows = list(reader)
    rows.reverse()
    rows.pop()

    for row in rows:
        person = dict()

        for i in range(len(row)):
            person[KEYS[i]] = row[i]

        person['CprNumber'] = '{}-{}'.format(person['Birthday'].replace(
            '-', ''), ''.join(random.choices(string.digits, k=4)))

        response = requests.post(
            'http://localhost:8080/nemId',
            data=dicttoxml(person, custom_root='Person'),
            headers={
                'Content-Type': 'application/xml'
            }
        )

        person['NemID'] = json.loads(
            response.content.decode('utf-8')).get('nemID', None)

        with open(person['CprNumber'] + '.msgpack', 'wb') as out:
            out.write(msgpack.packb(person))
