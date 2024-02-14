from graphviz import Digraph
# Process: Root gets activated by calling an activation task (defined and assigned to root runtime), root performs the task,
# saves the result in a 'context', calls the children's isActivationEligible by passing the context to the child,  
# every child that is eligible for activation does the same for its children. The path that is taken is relevant to the test data
# passed on the initial context. Once all test data is exhausted, all the un-visited nodes are shown (all nodes that haven't been visited
# after all test data is run, per test data obviously not all nodes will be visited because each test data will select a single flow
# to run) 

# Questions: Who should handle context - driver or node class. Used driver since context needs to be available across all nodes
# 2. How does the 'prior action results' object flow through the nodes? For now setting it on top node and having it flow through to children
# 3. How does the 'curr test data' object flow through the nodes? Same as above, but setting it on isActivationEligible

def trace(root):
    # builds a set of all nodes and edges in a graph
    nodes, edges = set(), set()
    def build(v):
        if v not in nodes:
            nodes.add(v)
            for child in v.children:
                edges.add((v, child))
                build(child)
    build(root)
    return nodes, edges

class Node:
    def __init__(self, description):
        self.description = description
        self.children = []
        self.testData = []
        self.edges = []
    
    def __repr__(self):
        return f"{self.description}"
    
    def setId(self, idd):
        self.id = idd

    def setContext(self, context):
        self.context = context
    
    def addChild(self, child):
        self.children.append(child)
    
    def display(self, globalVisited):
        dot = Digraph(format='svg', graph_attr={'rankdir': 'UD'}) # LR = left to right
        nodes, edges = trace(self)
        for n in nodes:
            uid = str(id(n))
            # for any value in the graph, create a rectangular ('record') node for it
            nodeColor = "green"
            if(n not in globalVisited):
                nodeColor = "red"
            dot.node(name = uid, label = "{ %s }" % (n), shape='record', color = nodeColor)

        for n1, n2 in edges:
            # connect n1 to the op node of n2
            dot.edge(str(id(n1)), str(id(n2)), n2.eligibilityDescription)

        return dot
    
    def setPriorActionResults(self, priorActionResults):
        self.priorActionResults = priorActionResults
    
    def setActivationEligibility(self, activationEligibilityFunction, eligibilityDescription):
        self.activationElibility=activationEligibilityFunction
        self.eligibilityDescription = eligibilityDescription
    
    def isActivationEligible(self, currTestData, context):
        isEligible = self.activationElibility(self.priorActionResults, currTestData, context)
        if(isEligible):
            self.setCurrTestData(currTestData)
        return isEligible
    
    def assignActivationTask(self, activationTaskFunction):
        self.activationTask=activationTaskFunction
        
    def setCurrTestData(self, currTestData):
        self.currTestData = currTestData
        if not currTestData in (self.testData):
            self.testData.append(currTestData)

    def addEdge(self, edgeString):
        if edgeString not in self.edges:
            self.edges.append(edgeString)
    
    def activate(self, context, globalVisited):
        actionResult=self.activationTask(self.priorActionResults, self.currTestData, context)
        self.priorActionResults[self.description]=actionResult
        globalVisited.add(self)
        # print("action complete, actionResults: ", self.priorActionResults)
        visited=set()
        
        for child in self.children:
            child.setPriorActionResults(self.priorActionResults)
            if((child.isActivationEligible(self.currTestData, context)) & (child not in visited)):
                child.addEdge(f'{self.id} -> {child.id}')
                visited.add(child)
                child.activate(context, globalVisited)
                
    def copyNodeWithoutChildren(self):
        nodeWithoutChildren = Node(self.description)
        nodeWithoutChildren.assignActivationTask(self.activationTask)
        nodeWithoutChildren.setActivationEligibility(self.activationElibility, self.eligibilityDescription)
        nodeWithoutChildren.testData = self.testData
        return nodeWithoutChildren
    
    def getIndividualBranches(self):
        if(len(self.children) == 0):
            nodeMinusChildren = self.copyNodeWithoutChildren()
            res = [[]]
            res[0].append(nodeMinusChildren)
            return res
        
        res = []
        for child in self.children:
            childBranches = child.getIndividualBranches()
            for childBranch in childBranches:
                childBranch.append(self.copyNodeWithoutChildren())
                res.append(childBranch)
        return res