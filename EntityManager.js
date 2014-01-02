var EntityManager = 
{
	lastID: 0,
	entityMap: {}, // [ENTITY NAME][component name] = actual component
	componentMap: {}, //[Component Names][entities with this]
	eventsMap: {}, //[Event Name][Component Name][callback]
	removeList: [],

	reset: function(){
		this.lastID = 0;
		this.entityMap = {};
		this.componentMap = {};
		// this.eventsMap = {};
		this.removeList = [];
	},

	getNextID: function(){
		this.lastID ++;
		return this.lastID;	
	},

	createEntity: function(){
		var id = "e_" + this.getNextID();
		this.entityMap[id] = {};
		return id;
	},
	
	addComponent: function(ent, component){
		this.entityMap[ent][component.name] = component;
		
		if (!this.componentMap[component.name]){
			this.componentMap[component.name] = [];	
		}
		this.componentMap[component.name].push(ent);
	},

	addComponentJustCompMap: function(ent, component){//Added late, not high-frequency, just a helper function. 
		if (!this.componentMap[component.name]){
			this.componentMap[component.name] = [];	
		}
		this.componentMap[component.name].push(ent);
	},	
	
	hasComponent: function(ent, comp){	
		var entity = ent;
		if (entity.constructor == String){
		}
		else{
			entity = entity.name;	
		}
		
		
		if (this.entityMap[entity][comp]){
			return true;	
		}
		else {
			return false;	
		}
	},
	
	
	getAllEntitiesWith: function(comp){
		return this.componentMap[comp];
	},
	
	
	getComponent: function(ent, comp){
		try{
			if (ent.constructor == String){
				return this.entityMap[ent][comp];
			}
			else{
				return this.entityMap[ent.name][comp];
			}
		}
		catch(e){
			console.log("ISSUE");
		}
	},
	
	getComponentStartsWith: function(ent,comp){
		var entity = ent;
		if (entity.constructor == String){
		}
		else{
			entity = entity.name;	
		}
		
		var keys = 	Object.keys(this.entityMap[entity]);
		var arr = this.entityMap[entity];
		for (var i = 0; i < keys.length; i++){
			if (keys[i].indexOf(comp) != -1 ){
				return arr[keys[i]];
			}
		}
	},
	
	getAllComponentsOf: function(ent){
		var entity = ent;
		if (entity.constructor == String){
		}
		else{
			entity = entity.name;	
		}
		
		if (this.entityMap[entity])
			return Object.keys(this.entityMap[entity]);	
		else
			return null;
	},
	
	removeComponent: function(ent, comp){
		this.entityMap[ent][comp] = null;
		delete this.entityMap[ent][comp];
		
		var arr = this.componentMap[comp]
		for (var i = 0; i < arr.length; i++){
			entity = arr[i]
			if (entity == ent){
				entity = null;
				arr.splice(i,1);
			}
		}
	},
	
	
	updateComponentMap: function(){
		this.componentMap = {};
		
		var keys = 	Object.keys(this.entityMap);
		
		//NOTE: MAKE SURE THAT _PROTO_ AND OTHER INHERENT PROPERTIES AREN'T ENUMERATED
		for (var i = 0; i < keys.length; i++){//For each known entity
				var newKeys = Object.keys(this.entityMap[keys[i]]);
				for (var k = 0; k < newKeys.length; k++){//For each of its component names
					var compon = this.entityMap[keys[i]][newKeys[k]];
					compon.name = newKeys[k];
					this.addComponentJustCompMap(keys[i], compon);
				}
		}
	},
	

	removeEntity: function(ent){
		var entity = ent;
		if (entity.constructor == String){
		}
		else{
			entity = entity.name;	
		}
				
		var comps = this.getAllComponentsOf(entity);
		for (var i = 0; i < comps.length; i++){
			this.removeComponent(entity,comps[i]);
		}
		
		this.entityMap[entity] = null;
		delete this.entityMap[entity];		
	},

	entityExists: function(ent){
		return this.entityMap.hasOwnProperty(ent);
	},


	addEntityEventListner: function(eventName, componentName, callback){
		if(this.eventsMap[eventName]){
		}
		else{
			this.eventsMap[eventName] = {};
		}

		if(this.eventsMap[eventName][componentName]){
		}
		else{
			this.eventsMap[eventName][componentName] = {};
		}

		if(this.eventsMap[eventName][componentName].callbacks){
		}
		else{
			this.eventsMap[eventName][componentName].callbacks = [];
		}

		this.eventsMap[eventName][componentName].callbacks.push(callback);
	},

	fireEntityEvent: function(entity, eventName, eventData){
		if(this.entityMap[entity]){
			if(this.eventsMap[eventName]){
				var comps = this.getAllComponentsOf(entity);
				for (var i = 0; i < comps.length; i++){
					if(this.eventsMap[eventName][comps[i]] ){
						if(this.eventsMap[eventName][comps[i]].callbacks){
							var callbackArr = this.eventsMap[eventName][comps[i]].callbacks;

							for(var j = 0; j < callbackArr.length; j++){
								callbackArr[j](entity, eventData);
							}
						}
						else{
							console.log("No callback on record.");
						}
					}
				}
			}
		}
		else{
			console.log("That entity doesn't exist");
		}
	},

	addToRemoveList: function(entity){
		this.removeList.push(entity);
	},

	flushRemoveList: function(){
		for(var i = 0; i < this.removeList.length; i++){
			if(this.entityExists(this.removeList[i])){
				this.removeEntity(this.removeList[i]);
			}
		}
		this.removeList = [];
	}
}
