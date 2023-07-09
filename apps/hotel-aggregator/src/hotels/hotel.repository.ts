//import { Neo4jService } from "@dbc-tech/nest-neo4j";
import { Injectable } from "@nestjs/common";

@Injectable()
export class HotelRepository{

    constructor() {
        
    }

    // async addNode(query,params) {
    //     const result = await this.neo4jService.write(query,params);
    //     console.log(result);
    //     return result;
    // }

    // async updateNode() {
        
    // }

    // async deleteNode() { 

    // }

    // async getNode(query,params) {
    //     const result = await this.neo4jService.read(query,params);
    //     console.log(result);
    //     return result;    
    // }


}