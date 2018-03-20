attributes = 5
attributeTemplate = "x#"
classCount = 5
dataLines = 10000

# python 3.6.4
from random import random

f = open('duomenys_generated.arff', 'w')
# Define header
f.write("@RELATION data\n")

# Define attributes
for x in range (0, attributes):
    attributeName = attributeTemplate.replace('#', str(x))
    f.write("@ATTRIBUTE {0} REAL\n".format(attributeName))

# Define class
f.write("@ATTRIBUTE class {")
for x in range (0, classCount):
    f.write(str(x) + ("" if x == classCount-1 else ","))
f.write("}\n")

# Generate data
f.write("@DATA\n")
for classIndex in range(0, classCount):
    boxPosition = random() * 10 - 5 # From -5 to 10
    boxSize = random() * 10 # From 0 to 10
    for classLineIndex in range(0, int(dataLines/classCount)):
        for attributeIndex in range(0, attributes):
            f.write(str(random() * boxSize - boxPosition) + ",")
        f.write(str(classIndex) + "\n")
