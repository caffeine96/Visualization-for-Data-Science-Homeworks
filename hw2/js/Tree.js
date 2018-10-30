/** Class representing a Tree. */
class Tree {
    /**
     * Creates a Tree Object
     * Populates a single attribute that contains a list (array) of Node objects to be used by the other functions in this class
     * note: Node objects will have a name, parentNode, parentName, children, level, and position
     * @param {json[]} json - array of json objects with name and parent fields
     */
    constructor(json) {
    	//console.log("Mega log");
        this.rootNode=null;								//Assigning rootNode
        this.nodes = [];								//Maintaining nodes 
        let keys = ["name","parent"];					//keys to retrieve json elemts
        for (let i = 0; i < json.length; i++){
            let temp = new Node(json[i][keys[0]],json[i][keys[1]]);			//Making Node
            this.nodes.push(temp);											//Push node in list

            if(this.nodes[i].parentName=="root"){							//Assigning rootNode
                this.rootNode = this.nodes[i];
            }

            for(let j=0; j<this.nodes.length; j++){						 	//Loop to add parentNode value
                if(this.nodes[j].name == this.nodes[i].parentName){			
                    this.nodes[i].parentNode = this.nodes[j];
                    break;
                }
            }   
               
        }

    }

    
    /**
     * Function that builds a tree from a list of nodes with parent refs
     */
    buildTree() {
        // note: in this function you will assign positions and levels by making calls to assignPosition() and assignLevel()
        for (let i = 0; i < this.nodes.length; i++){						//Identifying children
            for(let j=0; j<i; j++){								
                if(this.nodes[j].name == this.nodes[i].parentName){
                    this.nodes[j].addChild(this.nodes[i]);
                    break;
                }
            }   
               
        }

        //Calling assignLevel and assignPosition functions
        this.assignLevel(this.rootNode,0);
        this.assignPosition(this.rootNode,0);
    }

    /**
     * Recursive function that assign levels to each node
     */
    assignLevel(node, level) {
        node.level = level;
        for(let i = 0; i<node.children.length;++i){
            this.assignLevel(node.children[i],level+1);
        }
    }

    /**
     * Recursive function that assign positions to each node
     */
    assignPosition(node, position) {
        node.position = position;
        for(var i = 0; i<node.children.length;++i){
            position=this.assignPosition(node.children[i],position);
        }
        if(i==0){
            position=position+1;
        }
           
        return position;
        
    }

    /**
     * Function that renders the tree
     */
    renderTree() {
        let svgContainer = d3.select("body")
                            .append("svg")
                            .attr("width",1200)
                            .attr("height",1200);

        
        let lineFunction = svgContainer.selectAll("line")
                            .data(this.nodes)
                            .enter()
                            .append("line");

        let lineAttributes = lineFunction.attr("x1", function(d){
        							//console.log("asdasda");
        							//Logic to handle rootNode null parent
        							if(d.parentName==="root"){
        								return d.level*125 +125;
        							}
        							else{
        								return d.parentNode.level*125 +125;
        							}})
                                .attr("y1", function(d){
        							if(d.parentName==="root"){
        								return d.position*100 +100;
        							}
        							else{
        								return d.parentNode.position*100 +100;
        							}})
                                .attr("x2", d=>d.level*125 + 125)
                                .attr("y2", d=>d.position*100 + 100)
                                .attr("class","line");
        
        let allGroups = svgContainer.selectAll("g");

        allGroups.exit().remove();
        
        let Group = allGroups.data(this.nodes).enter().append("g")
        					.attr("transform", function(d){
        						var cx = d.level*125 + 125;
        						var cy = d.position*100 + 100;
        						//console.log("Isnide");
        						return "translate(" + cx+ ","+ cy + ")";
        					})
                            .attr("class","nodeGroup");

                    

        let groupData = Group.append("circle");
        let lineData = Group.append("text");


        let circleAttributes = Group.selectAll("circle")
                                .attr("r", 30);

        let labels = Group.selectAll("text")
                        .text(function(d){ return d.name})
                        .attr("class","label");
        
    }

}