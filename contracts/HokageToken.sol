pragma solidity ^0.5.8;

contract HokageToken{
    //name
    string public constant tokenName = 'HokageToken';
    //symbol
    string public constant tokenSymbol = 'Hokage';
    //decimal
    uint8 public constant tokenDecimal = 18;
    //standered < not erc20 token
    string public constant tokenStandered = 'HokageToken v1.0';
    //total supply of the coin
    uint256 public totalSupply;
    //balance of mapping
    mapping(address => uint256) public balances;
    //allowance
    mapping(address => mapping(address => uint256)) private allowed;


    constructor (uint256 _initialSupply) public{
        totalSupply = _initialSupply;
        //allocating the balance to admin account
        balances[msg.sender] = _initialSupply;
    }

    //transfer function
    function transfer(address _to, uint256 _value) public returns (bool success){

        //Exection if not sufficauebt balance
        require(balances[msg.sender] >= _value,'You dont have enogh tokens');

        //transfer
        balances[msg.sender] -= _value;
        balances[_to] += _value;

        //Transfer Event
        emit Transfer(msg.sender,_to,_value);

        //Return boolean
        return true;
    }

    /*
    * @param _value : number of token to be transfered
    * @param _to : to whomsoever it has to be transfered
    * @param _from : from whomsoever it is transfered
    * @return : boolean : if the transaction is successfully performed
    **> usually it is used in order to do withdraw workflow allowing contract to transfer token on your behalf
    **> Also we need to keep in mind this function SHOULD throw exception unless _from account has delibrately authorized the sender of the message via some mechanism
    **> Note Transfers of 0 values MUST be treated as normal transfers and fire the Transfer event.
    */
    //transfer from
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        //require _from has enough token
        require(_value <= balances[_from],'Cant transfer more than the required balance');
        require(_value <= allowance(_from, msg.sender), 'Some error has occured');

        //change the balance
        balances[_to] += _value;
        balances[_from] -= _value;

        //update the allowance
        allowed[_from][msg.sender] -= _value;

        //call transfer event
        emit Transfer(_from,_to,_value);

        //return boolean
        return true;
    }

    /*
    * @param _spender : to withdraw from account multiple time
    * @param _value : to withdraw the amount from the owner of the current account
    * @return : boolean : if the transaction is successfully performed
    **> This can lead to attact to the current account holder
    **> So, basically it is asking that account holder of A will approve account holder of B in order to spend money on his behalf
    **> Also client shold make sure that he create user interface in such a way that they are set to 0 before setting it to another value for the same spender; we will not be doing it in contract to allow backword compitability
    */
    //approve
    function approve(address _spender, uint256 _value) public returns (bool success){
        //allowance
        allowed[msg.sender][_spender] = _value;

        //approve event
        emit Approval(msg.sender,_spender,_value);

        return true;
    }

    //GETTERS

    /*
    * @param _owner : owner from whose account coin/token is withdrawn
    * @param _spender : the one who spends the token on behalf of the owner
    * @return : unint256 : number of token being still allowed to spend by spender
    */
    //allowance
    function allowance(address _owner, address _spender) public view returns (uint256 remaining){
        return allowed[_owner][_spender];
    }

    /*
    * @return : string : name of the token
    */
    //name
    function name() public pure returns (string memory){
        return tokenName;
    }

    /*
    * @return : string : name of the symbol
    */
    //symbol
    function symbol() public pure returns (string memory){
        return tokenSymbol;
    }

    /*
    * @return : unint8 : number of decimal places
    */
    //decimal
    function decimal() public pure returns (uint8){
        return tokenDecimal;
    }

    /*
    * @return : string : version of the contract
    */
    //standered
    function standered() public pure returns (string memory){
        return tokenStandered;
    }

    /*
    * @param _owner : owner from whose account coin/token is requested
    * @return : unint256 : number of token being given to the owner
    */
    //balanceOf
    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    //EVENTS
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );


}