import { Attributes, ResourceObject, Relationships } from './JsonAPIStructure';
export default class Entity {
    private readonly _type;
    private readonly _id?;
    private readonly _attributes;
    private readonly _relationships;
    constructor(resourceObject: ResourceObject);
    /**
     * Build a new Entity of the given type and attributes
     * (optionally providing and id)
     *
     * @param type
     * @param attributes
     * @param id
     */
    static build(type: string, attributes: Attributes, id?: string): Entity;
    /**
     * Return the type
     *
     * @return {String}
     */
    type(): string;
    /**
     * Return the ID
     *
     * @return {String|undefined}
     */
    id(): string | undefined;
    /**
     * Return all Attributes
     */
    attributes(): Attributes;
    /**
     * Return a single Attribute value
     *
     * @param name
     */
    attribute(name: string): string | number | boolean;
    /**
     * Return all Relationships
     *
     * @return {Object}
     */
    relationships(): Relationships;
    /**
     * Return a single Relationship value
     *
     * @param name
     */
    relationship(name: string): any;
    /**
     * Update the attributes of the Entity
     *
     * @param {Attributes} payload
     */
    update(payload?: Attributes): Entity;
    /**
     * Add a relationship to the Entity
     *
     * @param {string} relationship
     * @param {string} type
     * @param {string} id
     */
    addRelationship(relationship: string, type: string, id: string): Entity;
    /**
     * Removes a relationships from the Entity
     *
     * @param {string} type
     * @param {string} id
     */
    removeRelationship(type: string, id: string): Entity;
    /**
     * Output Entity as a JSON-serializable object
     *
     * @param {boolean} includeRelationships
     */
    toJson(includeRelationships?: boolean): {
        type: string;
        id: string;
        attributes: Attributes;
    };
    /**
     * Create a new Entity with merged current and updated properites
     *
     * @param {Object} updatedProperties
     */
    private cloneAndUpdate(updatedProperties?);
}
