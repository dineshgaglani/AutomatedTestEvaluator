# Testing Graph Engine

# Uncomment below for unit tests
# from . import utils

# Comment below for unit tests
from test import utils

# Uncomment below for unit tests
# from ..engine import Node

# Comment below for unit tests
from engine import Node

# 1. NoBranching - a -> b(true) -> c(true) for first data and a -> b(true) -> c(false) for second data test
def test_noBranchingEngine():
    rootNode = Node("root")
    rootNode.setId(1)
    rootNode.setActivationEligibility(utils.alwaysTrueActivationFunction, "alwaysTrue")
    rootNode.assignActivationTask(utils.returnNodeName)

    firstLevelChild = Node("firstLevelChild")
    firstLevelChild.setId(2)
    firstLevelChild.setActivationEligibility(utils.alwaysTrueActivationFunction, "alwaysTrue")
    firstLevelChild.assignActivationTask(utils.returnNodeName)

    secondLevelChild = Node("secondLevelChild")
    secondLevelChild.setId(3)
    secondLevelChild.setActivationEligibility(utils.returnTestDataActivationFunction, "first data: True, second: False")
    secondLevelChild.assignActivationTask(utils.returnNodeName)

    rootNode.addChild(firstLevelChild)
    firstLevelChild.addChild(secondLevelChild)

    globalVisitedTestObj = utils.GlobalVisitedTestStub()

    context = { "nodeName": "Testing" }
    # Node 3 depends on this
    testData = [True, False] 
    for singleTestData in testData:
        rootNode.setPriorActionResults({})
        rootNode.isActivationEligible(singleTestData, context)
        rootNode.activate(context, globalVisitedTestObj)
    
    # For first test data
    callRecorder = globalVisitedTestObj.getCallRecorder()
    assert callRecorder['1'].description == "root"
    assert callRecorder['2'].description == "firstLevelChild"
    assert "1 -> 2" in callRecorder['2'].edges
    assert len(callRecorder['2'].edges) == 1
    assert callRecorder['3'].description == "secondLevelChild"
    assert "2 -> 3" in callRecorder['3'].edges
    assert len(callRecorder['3'].edges) == 1

    # For second test data
    assert callRecorder['4'].description == "root"
    assert callRecorder['5'].description == "firstLevelChild"
    assert "1 -> 2" in callRecorder['5'].edges

    assert max(callRecorder, key=int) == '5'

# 2. Branching Base Node - a -> b(true)  -> c(true)
#                                        -> d(true) for first data 
#    Branching Base Node - a -> b(false) -> c(true)
#                                        -> d(true) for second data test
def test_branchingEngine():
    rootNode = Node("root")
    rootNode.setId(1)
    rootNode.setActivationEligibility(utils.alwaysTrueActivationFunction, "alwaysTrue")
    rootNode.assignActivationTask(utils.returnNodeName)

    firstLevelChild = Node("firstLevelChild")
    firstLevelChild.setId(2)
    firstLevelChild.setActivationEligibility(utils.returnTestDataActivationFunction, "first data: True, second: False")
    firstLevelChild.assignActivationTask(utils.returnNodeName)

    secondLevelFirstChild = Node("secondLevelFirstChild")
    secondLevelFirstChild.setId(3)
    secondLevelFirstChild.setActivationEligibility(utils.alwaysTrueActivationFunction, "alwaysTrue")
    secondLevelFirstChild.assignActivationTask(utils.returnNodeName)    

    secondLevelSecondChild = Node("secondLevelSecondChild")
    secondLevelSecondChild.setId(4)
    secondLevelSecondChild.setActivationEligibility(utils.alwaysTrueActivationFunction, "alwaysTrue")
    secondLevelSecondChild.assignActivationTask(utils.returnNodeName)

    globalVisitedTestObj = utils.GlobalVisitedTestStub()

    rootNode.addChild(firstLevelChild)
    firstLevelChild.addChild(secondLevelFirstChild)
    firstLevelChild.addChild(secondLevelSecondChild)

    context = { "nodeName": "Testing" }
    testData = [True, False]
    for singleTestData in testData:
        rootNode.setPriorActionResults({})
        rootNode.isActivationEligible(singleTestData, context)
        rootNode.activate(context, globalVisitedTestObj)
    
    # For first test data
    callRecorder = globalVisitedTestObj.getCallRecorder()
    assert callRecorder['1'].description == "root"
    assert callRecorder['2'].description == "firstLevelChild"
    assert "1 -> 2" in callRecorder['2'].edges
    assert len(callRecorder['2'].edges) == 1
    assert callRecorder['3'].description == "secondLevelFirstChild"
    assert "2 -> 3" in callRecorder['3'].edges
    assert len(callRecorder['3'].edges) == 1
    assert callRecorder['4'].description == "secondLevelSecondChild"
    assert "2 -> 4" in callRecorder['4'].edges
    assert len(callRecorder['4'].edges) == 1

    # For second test data
    assert callRecorder['5'].description == "root"

    assert max(callRecorder, key=int) == '5'

# 3. Branching and single node converging - a -> b(true) -> c(true) -> 
#                                                                           e (true)
#                                                        -> d (true) ->              for first data
# 3. Branching and single node converging - a -> b(true) -> c(false) -> 
#                                                                           e (true)
#                                                        -> d (true) ->              for second data
def test_branchingAndConvergingEngine():
    rootNode = Node("root")
    rootNode.setId(1)
    rootNode.setActivationEligibility(utils.alwaysTrueActivationFunction, "alwaysTrue")
    rootNode.assignActivationTask(utils.returnNodeName)

    firstLevelChild = Node("firstLevelChild")
    firstLevelChild.setId(2)
    firstLevelChild.setActivationEligibility(utils.alwaysTrueActivationFunction, "alwaysTrue")
    firstLevelChild.assignActivationTask(utils.returnNodeName)

    secondLevelFirstChild = Node("secondLevelFirstChild")
    secondLevelFirstChild.setId(3)
    secondLevelFirstChild.setActivationEligibility(utils.returnTestDataActivationFunction, "first data: True, second: False")
    secondLevelFirstChild.assignActivationTask(utils.returnNodeName)

    secondLevelSecondChild = Node("secondLevelSecondChild")
    secondLevelSecondChild.setId(4)
    secondLevelSecondChild.setActivationEligibility(utils.alwaysTrueActivationFunction, "alwaysTrue")
    secondLevelSecondChild.assignActivationTask(utils.returnNodeName)

    thirdLevelConvergenceNode = Node("ThirdLevelConvergenceNode")
    thirdLevelConvergenceNode.setId(5)
    thirdLevelConvergenceNode.setActivationEligibility(utils.alwaysTrueActivationFunction, "alwaysTrue")
    thirdLevelConvergenceNode.assignActivationTask(utils.returnNodeName)

    globalVisitedTestObj = utils.GlobalVisitedTestStub()

    rootNode.addChild(firstLevelChild)
    firstLevelChild.addChild(secondLevelFirstChild)
    firstLevelChild.addChild(secondLevelSecondChild)
    secondLevelFirstChild.addChild(thirdLevelConvergenceNode)
    secondLevelSecondChild.addChild(thirdLevelConvergenceNode)

    context = { "nodeName": "Testing" }
    testData = [True, False]
    for singleTestData in testData:
        rootNode.setPriorActionResults({})
        rootNode.isActivationEligible(singleTestData, context)
        rootNode.activate(context, globalVisitedTestObj)
    
    # For first test data
    callRecorder = globalVisitedTestObj.getCallRecorder()
    assert callRecorder['1'].description == "root"
    assert callRecorder['2'].description == "firstLevelChild"
    assert "1 -> 2" in callRecorder['2'].edges
    assert len(callRecorder['2'].edges) == 1
    assert callRecorder['3'].description == "secondLevelFirstChild"
    assert "2 -> 3" in callRecorder['3'].edges 
    assert len(callRecorder['2'].edges) == 1
    assert callRecorder['4'].description == "ThirdLevelConvergenceNode"
    assert "3 -> 5" in callRecorder['4'].edges
    assert callRecorder['5'].description == "secondLevelSecondChild"
    assert "2 -> 4" in callRecorder['5'].edges
    assert len(callRecorder['5'].edges) == 1
    assert callRecorder['6'].description == "ThirdLevelConvergenceNode"
    assert "4 -> 5" in callRecorder['6'].edges
    assert len(callRecorder['6'].edges) == 2 # Since this node was called twice as it the tree converges here

    # For second test data
    assert callRecorder['7'].description == "root"
    assert callRecorder['8'].description == "firstLevelChild"
    assert "1 -> 2" in callRecorder['8'].edges
    assert callRecorder['9'].description == "secondLevelSecondChild"
    assert "2 -> 4" in callRecorder['9'].edges
    assert callRecorder['10'].description == "ThirdLevelConvergenceNode"
    assert "4 -> 5" in callRecorder['10'].edges
    # Not for this data, but this node was called twice for the prev test data and edges are recorded for entire diagram and not for testdata 
    assert len(callRecorder['10'].edges) == 2 

    assert max(callRecorder, key=int) == '10'

# 4. Loop test a -> b(true) -> c(true) -> b(true). Expect - Second call to b is not executed, since it was executed previously in this tree
def test_loopingToImmediateParentNode():
    rootNode = Node("root")
    rootNode.setId(1)
    rootNode.setActivationEligibility(utils.alwaysTrueActivationFunction, "alwaysTrue")
    rootNode.assignActivationTask(utils.returnNodeName)

    firstLevelChild = Node("firstLevelChild")
    firstLevelChild.setId(2)
    firstLevelChild.setActivationEligibility(utils.alwaysTrueActivationFunction, "alwaysTrue")
    firstLevelChild.assignActivationTask(utils.returnNodeName)

    secondLevelChild = Node("secondLevelChild")
    secondLevelChild.setId(3)
    secondLevelChild.setActivationEligibility(utils.alwaysTrueActivationFunction, "first data: True, second: False")
    secondLevelChild.assignActivationTask(utils.returnNodeName)

    globalVisitedTestObj = utils.GlobalVisitedTestStub()

    rootNode.addChild(firstLevelChild)
    firstLevelChild.addChild(secondLevelChild)
    secondLevelChild.addChild(firstLevelChild)

    context = { "nodeName": "Testing" }
    testData = [True]
    for singleTestData in testData:
        rootNode.setPriorActionResults({})
        rootNode.isActivationEligible(singleTestData, context)
        rootNode.activate(context, globalVisitedTestObj)
    
    callRecorder = globalVisitedTestObj.getCallRecorder()
    assert callRecorder['1'].description == "root"
    assert callRecorder['2'].description == "firstLevelChild"
    assert "1 -> 2" in callRecorder['2'].edges
    assert len(callRecorder['2'].edges) == 1
    assert callRecorder['3'].description == "secondLevelChild"
    assert "2 -> 3" in callRecorder['3'].edges
    assert len(callRecorder['3'].edges) == 1

    assert max(callRecorder, key=int) == '3'


# 5. Loop to second node test a -> b -> c -> a test. Expect - Second call to a (root) is not executed, since it was executed previously in this tree
def test_loopingToEarlierAncestorNode():
    rootNode = Node("root")
    rootNode.setId(1)
    rootNode.setActivationEligibility(utils.alwaysTrueActivationFunction, "alwaysTrue")
    rootNode.assignActivationTask(utils.returnNodeName)

    firstLevelChild = Node("firstLevelChild")
    firstLevelChild.setId(2)
    firstLevelChild.setActivationEligibility(utils.alwaysTrueActivationFunction, "alwaysTrue")
    firstLevelChild.assignActivationTask(utils.returnNodeName)

    secondLevelChild = Node("secondLevelChild")
    secondLevelChild.setId(3)
    secondLevelChild.setActivationEligibility(utils.alwaysTrueActivationFunction, "first data: True, second: False")
    secondLevelChild.assignActivationTask(utils.returnNodeName)

    globalVisitedTestObj = utils.GlobalVisitedTestStub()

    rootNode.addChild(firstLevelChild)
    firstLevelChild.addChild(secondLevelChild)
    secondLevelChild.addChild(rootNode)

    context = { "nodeName": "Testing" }
    testData = [True]
    for singleTestData in testData:
        rootNode.setPriorActionResults({})
        rootNode.isActivationEligible(singleTestData, context)
        rootNode.activate(context, globalVisitedTestObj)

    callRecorder = globalVisitedTestObj.getCallRecorder()
    assert callRecorder['1'].description == "root"
    assert callRecorder['2'].description == "firstLevelChild"
    assert "1 -> 2" in callRecorder['2'].edges
    assert len(callRecorder['2'].edges) == 1
    assert callRecorder['3'].description == "secondLevelChild"
    assert "2 -> 3" in callRecorder['3'].edges
    assert len(callRecorder['3'].edges) == 1

    assert max(callRecorder, key=int) == '3'


# 6. Loop to Ancestor Sibling - a -> b(true) -> c(true) -> e (true)
#                                                 |------------------|      
#                                                                    |(true)
#                                            -> d(true) -> f (true) -|    (f goes back to c so path is a, b, d, f, c, e)   
# Loop to Ancestor Sibling - a -> b(true) -> c(true) -> e (true)
#                                                 |------------------|      
#                                                                    |(false)
#                                            -> d(true) -> f (true) -|    (f goes back to c but false so path is a, b, d, f)    
def test_loopToAncestorSiblingNode():
    rootNode = Node("root") # a node
    rootNode.setId(1)
    rootNode.setActivationEligibility(utils.alwaysTrueActivationFunction, "alwaysTrue")
    rootNode.assignActivationTask(utils.returnNodeName)

    firstLevelChild = Node("firstLevelChild") # b node
    firstLevelChild.setId(2)
    firstLevelChild.setActivationEligibility(utils.alwaysTrueActivationFunction, "alwaysTrue")
    firstLevelChild.assignActivationTask(utils.returnNodeName)

    booleanProvider = utils.returnSequenceOfBooleansInOrder([True, True, True, False]) # c node
    secondLevelFirstAndLoopBackChild = Node("secondLevelFirstAndLoopBackChild")
    secondLevelFirstAndLoopBackChild.setId(3)
    secondLevelFirstAndLoopBackChild.setActivationEligibility(booleanProvider, "firstData firstCall: true, firstData secondCall: true, secondData firstCall: true, secondData secondCall: false")
    secondLevelFirstAndLoopBackChild.assignActivationTask(utils.returnNodeName)

    secondLevelSecondChild = Node("secondLevelSecondChild") # d node
    secondLevelSecondChild.setId(4)
    secondLevelSecondChild.setActivationEligibility(utils.alwaysTrueActivationFunction, "alwaysTrue")
    secondLevelSecondChild.assignActivationTask(utils.returnNodeName)

    thirdLevelFirstChild = Node("thirdLevelFirstChild") # e node
    thirdLevelFirstChild.setId(5)
    thirdLevelFirstChild.setActivationEligibility(utils.alwaysTrueActivationFunction, "alwaysTrue")
    thirdLevelFirstChild.assignActivationTask(utils.returnNodeName)

    thirdLevelSecondChildAndLoopbackParent = Node("thirdLevelSecondChildAndLoopbackParent") # f node
    thirdLevelSecondChildAndLoopbackParent.setId(6)
    thirdLevelSecondChildAndLoopbackParent.setActivationEligibility(utils.alwaysTrueActivationFunction, "alwaysTrue")
    thirdLevelSecondChildAndLoopbackParent.assignActivationTask(utils.returnNodeName)

    globalVisitedTestObj = utils.GlobalVisitedTestStub()

    rootNode.addChild(firstLevelChild)
    firstLevelChild.addChild(secondLevelFirstAndLoopBackChild)
    firstLevelChild.addChild(secondLevelSecondChild)
    secondLevelFirstAndLoopBackChild.addChild(thirdLevelFirstChild)
    secondLevelSecondChild.addChild(thirdLevelSecondChildAndLoopbackParent)
    thirdLevelSecondChildAndLoopbackParent.addChild(secondLevelFirstAndLoopBackChild)

    context = { "nodeName": "Testing" }
    testData = [True, False]

    for singleTestData in testData:
        rootNode.setPriorActionResults({})
        rootNode.isActivationEligible(singleTestData, context)
        rootNode.activate(context, globalVisitedTestObj)
    
    # For first test data
    callRecorder = globalVisitedTestObj.getCallRecorder()
    assert callRecorder['1'].description == "root"
    assert callRecorder['2'].description == "firstLevelChild"
    assert "1 -> 2" in callRecorder['2'].edges
    assert len(callRecorder['2'].edges) == 1
    assert callRecorder['3'].description == "secondLevelFirstAndLoopBackChild"
    assert "2 -> 3" in callRecorder['3'].edges 
    assert len(callRecorder['3'].edges) == 2
    assert callRecorder['4'].description == "thirdLevelFirstChild"
    assert "3 -> 5" in callRecorder['4'].edges
    assert len(callRecorder['4'].edges) == 1
    assert callRecorder['5'].description == "secondLevelSecondChild"
    assert "2 -> 4" in callRecorder['5'].edges
    assert len(callRecorder['5'].edges) == 1
    assert callRecorder['6'].description == "thirdLevelSecondChildAndLoopbackParent"
    assert "4 -> 6" in callRecorder['6'].edges
    assert len(callRecorder['6'].edges) == 1
    assert callRecorder['7'].description == "secondLevelFirstAndLoopBackChild"
    assert "6 -> 3" in callRecorder['7'].edges
    assert len(callRecorder['7'].edges) == 2 # Since this node was called twice first from first level child and then from third level loopback
    assert callRecorder['8'].description == "thirdLevelFirstChild"
    assert "3 -> 5" in callRecorder['8'].edges
    # This node was called twice, but from the same parent, and we only record one interaction between the same nodes regardless of how many times they interact
    assert len(callRecorder['8'].edges) == 1 
    
    # For second test data
    assert callRecorder['9'].description == "root"
    assert callRecorder['10'].description == "firstLevelChild"
    assert "1 -> 2" in callRecorder['10'].edges
    assert len(callRecorder['10'].edges) == 1
    assert callRecorder['11'].description == "secondLevelFirstAndLoopBackChild"
    assert "2 -> 3" in callRecorder['11'].edges 
    assert len(callRecorder['11'].edges) == 2 # Two because it is accessed twice in previous test data
    assert callRecorder['12'].description == "thirdLevelFirstChild"
    assert "3 -> 5" in callRecorder['12'].edges
    assert len(callRecorder['12'].edges) == 1
    assert callRecorder['13'].description == "secondLevelSecondChild"
    assert "2 -> 4" in callRecorder['13'].edges
    assert len(callRecorder['13'].edges) == 1
    assert callRecorder['14'].description == "thirdLevelSecondChildAndLoopbackParent"
    assert "4 -> 6" in callRecorder['14'].edges
    assert len(callRecorder['14'].edges) == 1

    assert max(callRecorder, key=int) == '14'


# 7. Loop to child repeatedly - 
#                                 a -> b   --true--> f
#                                                    ^
#                               true-> c   --true----| 
#                              false-> d   --false---|
#                              false-> e   --false---|
def test_loopByContext():
    #Context has number of iteration, ActivationEligibility views context has gt 0 iterations, ActivationFunction reduces context iterations
    rootNode = Node("root") # a node
    rootNode.setId(1)
    rootNode.setActivationEligibility(utils.alwaysTrueActivationFunction, "alwaysTrue")
    rootNode.assignActivationTask(utils.returnNodeName)

    firstLevelChild = Node("firstLevelChild") # b node
    firstLevelChild.setId(2)
    firstLevelChild.setActivationEligibility(utils.contextBasedBooleanActivationFunction, "Read context for action")
    firstLevelChild.assignActivationTask(utils.reduceContextIterationActivationFunction)

    firstLevelSecondChild = Node("firstLevelSecondChild") # c node
    firstLevelSecondChild.setId(3)
    firstLevelSecondChild.setActivationEligibility(utils.contextBasedBooleanActivationFunction, "Read context for action")
    firstLevelSecondChild.assignActivationTask(utils.reduceContextIterationActivationFunction)

    firstLevelThirdChild = Node("firstLevelThirdChild") # d node
    firstLevelThirdChild.setId(4)
    firstLevelThirdChild.setActivationEligibility(utils.contextBasedBooleanActivationFunction, "Read context for action")
    firstLevelThirdChild.assignActivationTask(utils.reduceContextIterationActivationFunction)

    firstLevelFourthChild = Node("firstLevelFourthChild") # e node
    firstLevelFourthChild.setId(5)
    firstLevelFourthChild.setActivationEligibility(utils.contextBasedBooleanActivationFunction, "Read context for action")
    firstLevelFourthChild.assignActivationTask(utils.reduceContextIterationActivationFunction)

    secondLevelFirstChild = Node("secondLevelFirstChild") # f node
    secondLevelFirstChild.setId(6)
    secondLevelFirstChild.setActivationEligibility(utils.alwaysTrueActivationFunction, "Always true")
    secondLevelFirstChild.assignActivationTask(utils.reduceContextIterationActivationFunction)

    rootNode.addChild(firstLevelChild)
    rootNode.addChild(firstLevelSecondChild)
    rootNode.addChild(firstLevelThirdChild)
    rootNode.addChild(firstLevelFourthChild)
    firstLevelChild.addChild(secondLevelFirstChild)
    firstLevelSecondChild.addChild(secondLevelFirstChild)
    firstLevelThirdChild.addChild(secondLevelFirstChild)
    firstLevelFourthChild.addChild(secondLevelFirstChild)

    globalVisitedTestObj = utils.GlobalVisitedTestStub()

    context = { "nodeName": "Testing", "iterations": 3 }

    testData = [True] 
    for singleTestData in testData:
        rootNode.setPriorActionResults({})
        rootNode.isActivationEligible(singleTestData, context)
        rootNode.activate(context, globalVisitedTestObj)

    callRecorder = globalVisitedTestObj.getCallRecorder()
    assert callRecorder['1'].description == "root"
    assert callRecorder['2'].description == "firstLevelChild"
    assert "1 -> 2" in callRecorder['2'].edges
    assert len(callRecorder['2'].edges) == 1
    assert callRecorder['3'].description == "secondLevelFirstChild"
    assert "2 -> 6" in callRecorder['3'].edges
    assert len(callRecorder['3'].edges) == 2
    assert callRecorder['4'].description == "firstLevelSecondChild"
    assert "1 -> 3" in callRecorder['4'].edges
    assert len(callRecorder['4'].edges) == 1
    assert callRecorder['5'].description == "secondLevelFirstChild"
    assert "3 -> 6" in callRecorder['5'].edges
    assert len(callRecorder['5'].edges) == 2

    assert max(callRecorder, key=int) == '5'


# 8. Loop to child based on test data  
#                                 a -> b   --true--> f
#                                                    ^
#                               true-> c   --true----| 
#                              false-> d   --false---|
#                              false-> e   --false---|
def test_loopByTestData():
    #TestData has number of iteration, ActivationEligibility views testdata has gt 0 iterations, ActivationFunction reduces testdata iterations
    rootNode = Node("root") # a node
    rootNode.setId(1)
    rootNode.setActivationEligibility(utils.alwaysTrueActivationFunction, "alwaysTrue")
    rootNode.assignActivationTask(utils.returnNodeName)

    firstLevelChild = Node("firstLevelChild") # b node
    firstLevelChild.setId(2)
    firstLevelChild.setActivationEligibility(utils.testDataBasedBooleanActivationFunction, "Read testData for action")
    firstLevelChild.assignActivationTask(utils.reduceTestDataIterationActivationFunction)

    firstLevelSecondChild = Node("firstLevelSecondChild") # c node
    firstLevelSecondChild.setId(3)
    firstLevelSecondChild.setActivationEligibility(utils.testDataBasedBooleanActivationFunction, "Read testData for action")
    firstLevelSecondChild.assignActivationTask(utils.reduceTestDataIterationActivationFunction)

    firstLevelThirdChild = Node("firstLevelThirdChild") # d node
    firstLevelThirdChild.setId(4)
    firstLevelThirdChild.setActivationEligibility(utils.testDataBasedBooleanActivationFunction, "Read testData for action")
    firstLevelThirdChild.assignActivationTask(utils.reduceTestDataIterationActivationFunction)

    firstLevelFourthChild = Node("firstLevelFourthChild") # e node
    firstLevelFourthChild.setId(5)
    firstLevelFourthChild.setActivationEligibility(utils.testDataBasedBooleanActivationFunction, "Read testData for action")
    firstLevelFourthChild.assignActivationTask(utils.reduceTestDataIterationActivationFunction)

    secondLevelFirstChild = Node("secondLevelFirstChild") # f node
    secondLevelFirstChild.setId(6)
    secondLevelFirstChild.setActivationEligibility(utils.alwaysTrueActivationFunction, "Always true")
    secondLevelFirstChild.assignActivationTask(utils.reduceTestDataIterationActivationFunction)

    rootNode.addChild(firstLevelChild)
    rootNode.addChild(firstLevelSecondChild)
    rootNode.addChild(firstLevelThirdChild)
    rootNode.addChild(firstLevelFourthChild)
    firstLevelChild.addChild(secondLevelFirstChild)
    firstLevelSecondChild.addChild(secondLevelFirstChild)
    firstLevelThirdChild.addChild(secondLevelFirstChild)
    firstLevelFourthChild.addChild(secondLevelFirstChild)

    globalVisitedTestObj = utils.GlobalVisitedTestStub()

    context = { "nodeName": "Testing" }

    testData = [{ "iterations": 3 }] 
    for singleTestData in testData:
        rootNode.setPriorActionResults({})
        rootNode.isActivationEligible(singleTestData, context)
        rootNode.activate(context, globalVisitedTestObj)

    callRecorder = globalVisitedTestObj.getCallRecorder()
    assert callRecorder['1'].description == "root"
    assert callRecorder['2'].description == "firstLevelChild"
    assert "1 -> 2" in callRecorder['2'].edges
    assert len(callRecorder['2'].edges) == 1
    assert callRecorder['3'].description == "secondLevelFirstChild"
    assert "2 -> 6" in callRecorder['3'].edges
    assert len(callRecorder['3'].edges) == 2
    assert callRecorder['4'].description == "firstLevelSecondChild"
    assert "1 -> 3" in callRecorder['4'].edges
    assert len(callRecorder['4'].edges) == 1
    assert callRecorder['5'].description == "secondLevelFirstChild"
    assert "3 -> 6" in callRecorder['5'].edges
    assert len(callRecorder['5'].edges) == 2

    assert max(callRecorder, key=int) == '5'

# 9. Loop to child based on priorActionResult - 
#                                 a -> b   --true--> f
#                                                    ^
#                               true-> c   --true----| 
#                              false-> d   --false---|
#                              false-> e   --false---|
def test_loopByPriorAction():
    #A node result has number of iteration, ActivationEligibility views priorResults has gt 0 iterations, ActivationFunction reduces priorResults iterations
    rootNode = Node("root") # a node
    rootNode.setId(1)
    rootNode.setActivationEligibility(utils.alwaysTrueActivationFunction, "alwaysTrue")
    rootNode.assignActivationTask(utils.returnIterationsActivationTask)

    firstLevelChild = Node("firstLevelChild") # b node
    firstLevelChild.setId(2)
    firstLevelChild.setActivationEligibility(utils.priorActionResultsBooleanActivationFunction, "Read priorActionResults for action")
    firstLevelChild.assignActivationTask(utils.reducePriorActionIterationsActivationTask)

    firstLevelSecondChild = Node("firstLevelSecondChild") # c node
    firstLevelSecondChild.setId(3)
    firstLevelSecondChild.setActivationEligibility(utils.priorActionResultsBooleanActivationFunction, "Read priorActionResults for action")
    firstLevelSecondChild.assignActivationTask(utils.reducePriorActionIterationsActivationTask)

    firstLevelThirdChild = Node("firstLevelThirdChild") # d node
    firstLevelThirdChild.setId(4)
    firstLevelThirdChild.setActivationEligibility(utils.priorActionResultsBooleanActivationFunction, "Read priorActionResults for action")
    firstLevelThirdChild.assignActivationTask(utils.reducePriorActionIterationsActivationTask)

    firstLevelFourthChild = Node("firstLevelFourthChild") # e node
    firstLevelFourthChild.setId(5)
    firstLevelFourthChild.setActivationEligibility(utils.priorActionResultsBooleanActivationFunction, "Read priorActionResults for action")
    firstLevelFourthChild.assignActivationTask(utils.reducePriorActionIterationsActivationTask)

    secondLevelFirstChild = Node("secondLevelFirstChild") # f node
    secondLevelFirstChild.setId(6)
    secondLevelFirstChild.setActivationEligibility(utils.alwaysTrueActivationFunction, "Always true")
    secondLevelFirstChild.assignActivationTask(utils.reducePriorActionIterationsActivationTask)

    rootNode.addChild(firstLevelChild)
    rootNode.addChild(firstLevelSecondChild)
    rootNode.addChild(firstLevelThirdChild)
    rootNode.addChild(firstLevelFourthChild)
    firstLevelChild.addChild(secondLevelFirstChild)
    firstLevelSecondChild.addChild(secondLevelFirstChild)
    firstLevelThirdChild.addChild(secondLevelFirstChild)
    firstLevelFourthChild.addChild(secondLevelFirstChild)

    globalVisitedTestObj = utils.GlobalVisitedTestStub()

    context = { "nodeName": "Testing" }

    testData = [True] 
    for singleTestData in testData:
        rootNode.setPriorActionResults({})
        rootNode.isActivationEligible(singleTestData, context)
        rootNode.activate(context, globalVisitedTestObj)

    callRecorder = globalVisitedTestObj.getCallRecorder()
    assert callRecorder['1'].description == "root"
    assert callRecorder['2'].description == "firstLevelChild"
    assert "1 -> 2" in callRecorder['2'].edges
    assert len(callRecorder['2'].edges) == 1
    assert callRecorder['3'].description == "secondLevelFirstChild"
    assert "2 -> 6" in callRecorder['3'].edges
    assert len(callRecorder['3'].edges) == 2
    assert callRecorder['4'].description == "firstLevelSecondChild"
    assert "1 -> 3" in callRecorder['4'].edges
    assert len(callRecorder['4'].edges) == 1
    assert callRecorder['5'].description == "secondLevelFirstChild"
    assert "3 -> 6" in callRecorder['5'].edges
    assert len(callRecorder['5'].edges) == 2

    assert max(callRecorder, key=int) == '5'
