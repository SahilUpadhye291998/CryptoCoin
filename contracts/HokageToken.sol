pragma solidity ^0.5.8;

contract HokageToken{
    //name
    string public constant name = 'HokageToken';
    //symbol
    string public constant symbol = 'Hokage';
    //decimal
    uint8 public constant decimal = 18;
    //standered < not erc20 token
    string public constant standered = 'HokageToken v1.0';
    //total supply of the coin
    uint256 public totalSupply;
    //balance of mapping
    mapping(address => uint256) public balanceOf;

    constructor(uint256 _initialSupply) public{
        totalSupply = _initialSupply;
        //allocating the balance to admin account
        balanceOf[msg.sender] = _initialSupply;
    }

    //transfer function
    function transfer(address _to, uint256 _value) public returns (bool success){

        //Exection if not sufficauebt balance
        require(balanceOf[msg.sender] >= _value,'You dont have enogh tokens');

        //transfer
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        //Transfer Event
        emit Transfer(msg.sender,_to,_value);

        //Return boolean
        return true;
    }

    function testFunction(uint256 _test) public pure returns(bool success){

        require(_test == 666, 'it is not equal to -666');

        return true;

    }



    //EVENTS
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

}