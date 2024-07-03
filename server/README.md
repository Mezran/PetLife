# Pet Life Server readme.

## Description

## Testing instructions:

##### For testing endpoints:

invalid tests:

- without a cookie
- empty body
- empty values in body
- invalid values in body
- invalid fields

valid tests:

- required fields
- all fields
- ensure counts are correct

##### For testing endpoints with path variables (api/something/:id):

invalid tests:

- without a cookie
- empty body
- empty values in body
- invalid values in body
- invalid :ids in url
- :id not associated with cookie
- invalid fields

valid tests:

- required fields
- all fields
- ensure counts are correct
