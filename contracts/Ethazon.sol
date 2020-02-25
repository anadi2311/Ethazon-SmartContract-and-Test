pragma solidity ^0.5.0;


// it is assumed that Ethazon is the seller and all the money will go to it
// also it is assumed that Ethazon is the deployer
contract Ethazon{
    string public storeName;
    uint public orderCost = 2 ether;
    address payable admin;

    struct Order{
        bool isValidEthazonOrder;
        string customerName;
        string shipmentAddress;
        bool hasConfirmed;    
    }

    event OrderGenerated(
        uint OrderId,
        string customerName,
        string shipmentAddress
    );
    
    event OrderConfirmed(
        bool hasConfirmed);


    mapping(uint => address payable) public orderToCustomer;
    mapping(address => uint) public customerToOrderMade;
    mapping(address=> uint) public customerToOrderConfirmed;


    
    constructor() public{
        admin = msg.sender;
        storeName = "Ethazon.com";
    }

    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;}


    Order[] public orders;
    
    
    function _createOrder( string memory _customerName, string memory _shipmentAddress) internal{
        
        uint id = orders.push(Order(true,_customerName, _shipmentAddress, false));
        orderToCustomer[id] = msg.sender;
        emit OrderGenerated( id, _customerName, _shipmentAddress);
        customerToOrderMade[msg.sender]++;
    
    }
    
    function createOrder( string memory _customerName, string memory _shipmentAddress) public payable {
        require(msg.value == orderCost);
        require(bytes(_customerName).length > 0, "customer's name is required!");
        require(bytes(_shipmentAddress).length>0, "cusomer's address is requried");
        require(customerToOrderMade[msg.sender] < customerToOrderConfirmed[msg.sender]);
        require(msg.sender != address(0));
        
        _createOrder(_customerName, _shipmentAddress);


        } 

    function confirmOrder( uint orderId ) public {
        Order memory _order = orders[orderId];
        require( _order.isValidEthazonOrder = true);
        
        
        _order.hasConfirmed = true;
        customerToOrderConfirmed[msg.sender]++;
        orders[orderId] = _order;
        emit OrderConfirmed(true);

    }


    function recieveEther() public onlyAdmin {
        admin.transfer(address(this).balance);
    }
    
    function cancelOrder(uint _orderId) public {
        
        require(orderToCustomer[_orderId]==msg.sender);
        require(orders[_orderId].hasConfirmed == false);
        address payable _orderer = orderToCustomer[_orderId];
        _orderer.transfer(orderCost);
        delete orderToCustomer[_orderId];
    }

    
        
        
        
    







}       