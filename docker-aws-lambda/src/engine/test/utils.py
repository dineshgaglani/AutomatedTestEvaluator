def alwaysTrueActivationFunction(priorActionResults, currTestData, context):
    return True

def alwaysFalseActivationFunction(priorActionResults, currTestData, context):
    return False

def returnTestDataActivationFunction(priorActionResults, currTestData, context):
    return currTestData

def returnSequenceOfBooleansInOrder(booleanSequence):
    call_count = [-1]
    
    def returnCallNumberFromBooleanSequence(priorActionResults, currTestData, context):
        call_count[0] += 1
        return booleanSequence[call_count[0]]

    return returnCallNumberFromBooleanSequence


def returnNodeName(priorActionResults, currTestData, context):
    return context['nodeName']

class GlobalVisitedTestStub:

    def __init__(self):
        self.callRecorder = {'0': '0'}
    
    def add(self, nodeToRecord):
        recentCallNumber = self.getRecentCallNumber()
        print(f'recentCallNumber: {str(recentCallNumber)}')
        self.callRecorder[f'{int(recentCallNumber) + 1}'] = nodeToRecord
        print(f'nodeDescription: {str(nodeToRecord.description)}, nodeTestData: {str(nodeToRecord.currTestData)}, nodeActionResults: {str(nodeToRecord.priorActionResults)}')

    def getRecentCallNumber(self):
        return max(self.callRecorder, key=int)

    def getCallRecorder(self):
        return self.callRecorder
    
