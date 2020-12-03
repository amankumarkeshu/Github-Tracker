#!
commitData <- read.csv("activity.csv")
barplot(height=commitData$total,names.arg=commitData$number)

additionData <- read.csv("additions.csv")
barplot(height=additionData$addition,names.arg=additionData$number)

additionData
deletionData <- read.csv("deletions.csv")
barplot(height=deletionData$deletion,names.arg=deletionData$number)
