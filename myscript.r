#!
commitData <- read.csv("activity.csv")
barplot(height=commitData$total,names.arg=commitData$number,xlab = "Week",
ylab = "Commits")

additionData <- read.csv("additions.csv")
barplot(height=additionData$addition,names.arg=additionData$number,xlab = "Week",
ylab = "Additions")

additionData
deletionData <- read.csv("deletions.csv")
barplot(height=deletionData$deletion,names.arg=deletionData$number,xlab = "Week",
ylab = "Deletions")
