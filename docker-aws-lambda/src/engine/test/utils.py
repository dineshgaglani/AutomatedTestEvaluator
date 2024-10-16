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

def contextBasedBooleanActivationFunction(priorActionResults, currTestData, context):
    print(f'context iterations in contextBasedBooleanActivationFunction: {int(context['iterations'])}')
    return context['iterations'] > 0

def reduceContextIterationActivationFunction(priorActionResults, currTestData, context):
    print(f'context iterations in reduceContextIterationActivationFunction: {int(context['iterations'])}')
    context['iterations'] = context['iterations'] - 1
    return context['iterations']

def testDataBasedBooleanActivationFunction(priorActionResults, currTestData, context):
    print(f'currTestData iterations in contextBasedBooleanActivationFunction: {int(currTestData['iterations'])}')
    return currTestData['iterations'] > 0

def priorActionResultsBooleanActivationFunction(priorActionResults, currTestData, context):
    return priorActionResults['root']['iterations'] > 0

def reduceTestDataIterationActivationFunction(priorActionResults, currTestData, context):
    print(f'testdata iterations in reduceContextIterationActivationFunction: {int(currTestData['iterations'])}')
    currTestData['iterations'] = currTestData['iterations'] - 1
    return currTestData['iterations']

def returnIterationsActivationTask(priorActionResults, currTestData, context):
    return {'iterations': 3}

def reducePriorActionIterationsActivationTask(priorActionResults, currTestData, context):
    priorActionResults['root']['iterations'] = priorActionResults['root']['iterations'] - 1
    return 'decremented firstLevelChild iterations from priorActionResults'


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
    
