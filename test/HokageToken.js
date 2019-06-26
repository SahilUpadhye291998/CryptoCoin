var HokageToken = artifacts.require("HokageToken");

contract("HokageToken", function (accounts) {
    it("sets the supply at the time of deployment", function () {
        return HokageToken.deployed()
            .then(function (instance) {
                tokenInstance = instance;
                return tokenInstance.totalSupply();
            })
            .then(function (totalSupply) {
                assert.equal(
                    totalSupply.toNumber(),
                    1000000,
                    "sets the total supply to 1000000"
                );
            });
    });

    it("see if the balance of admin is set", function () {
        return HokageToken.deployed()
            .then(function (instance) {
                tokenInstance = instance;
                return tokenInstance.balanceOf(accounts[0]);
            })
            .then(function (adminBalance) {
                assert.equal(
                    adminBalance.toNumber(),
                    1000000,
                    "It sets the balance of the admin perfetly"
                );
            });
    });

    it("see if name, symbol and standered are up to date", function () {
        return HokageToken.deployed()
            .then(function (instance) {
                tokenInstance = instance;
                return tokenInstance.name();
            })
            .then(function (name) {
                assert.equal(name, "HokageToken", "name is coorectly set");
                return tokenInstance.symbol();
            })
            .then(function (symbol) {
                assert.equal(symbol, "Hokage", "symbol is coorectly set");
                return tokenInstance.standered();
            })
            .then(function (standered) {
                assert.equal(
                    standered,
                    "HokageToken v1.0",
                    "standered is at current version"
                );
            });
    });

    it("see if transfer function is working or not", function () {
        return HokageToken.deployed()
            .then(function (instance) {
                tokenInstance = instance;
                // Test `require` statement first by transferring something larger than the sender's balance
                return tokenInstance.transfer.call(accounts[1], 999999);
            })
            .then(assert.pass)
            .catch(function (error) {
                assert(
                    error.message.indexOf("revert") >= 0,
                    "error message must contain revert"
                );
                return tokenInstance.transfer.call(accounts[1], 250000, {
                    from: accounts[0]
                });
            })
            .then(function (success) {
                assert.equal(success, true, "it returns true");
                return tokenInstance.transfer(accounts[1], 250000, {
                    from: accounts[0]
                });
            })
            .then(function (receipt) {
                assert.equal(receipt.logs.length, 1, "triggers one event");
                assert.equal(
                    receipt.logs[0].event,
                    "Transfer",
                    'should be the "Transfer" event'
                );
                assert.equal(
                    receipt.logs[0].args._from,
                    accounts[0],
                    "logs the account the tokens are transferred from"
                );
                assert.equal(
                    receipt.logs[0].args._to,
                    accounts[1],
                    "logs the account the tokens are transferred to"
                );
                assert.equal(
                    receipt.logs[0].args._value,
                    250000,
                    "logs the transfer amount"
                );
                return tokenInstance.balanceOf(accounts[1]);
            })
            .then(function (balance) {
                assert.equal(
                    balance.toNumber(),
                    250000,
                    "adds the amount to the receiving account"
                );
                return tokenInstance.balanceOf(accounts[0]);
            })
            .then(function (balance) {
                assert.equal(
                    balance.toNumber(),
                    750000,
                    "deducts the amount from the sending account"
                );
            });
    });

    it("see if approve function is working or not", function () {
        return HokageToken.deployed()
            .then(function (instance) {
                tokenInstance = instance;
                // Test `require` statement first by transferring something larger than the sender's balance
                return tokenInstance.approve.call(accounts[1], 100);
            })
            .then(function (success) {
                assert.equal(success, true, "it returns true");
                return tokenInstance.approve(accounts[1], 1000, {
                    from: accounts[0]
                });
            })
            .then(function (receipt) {
                assert.equal(receipt.logs.length, 1, "triggers one event");
                assert.equal(
                    receipt.logs[0].event,
                    "Approval",
                    'should be the "Approval" event'
                );
                assert.equal(
                    receipt.logs[0].args._owner,
                    accounts[0],
                    "logs the account the tokens are transferred from"
                );
                assert.equal(
                    receipt.logs[0].args._spender,
                    accounts[1],
                    "logs the account the tokens are transferred to"
                );
                assert.equal(
                    receipt.logs[0].args._value,
                    1000,
                    "logs the transfer amount"
                );
            });


    });

    it('handles delegated token transfers', function () {
        return HokageToken.deployed().then(function (instance) {
            tokenInstance = instance;
            fromAccount = accounts[2]; //from whose wallet token is going
            toAccount = accounts[3];
            spendingAccount = accounts[4]; //who is spending the token
            // Transfer some tokens to fromAccount
            return tokenInstance.transfer(fromAccount, 100, {
                from: accounts[0]
            }).then(function (receipt) {
                return tokenInstance.approve(spendingAccount, 10, {
                    from: fromAccount
                });
            }).then(function (receipt) {
                return tokenInstance.transferFrom(fromAccount, toAccount, 9999, {
                    from: spendingAccount
                });
            }).then(assert.fail).catch(function (error) {
                assert(error.message.indexOf('revert') >= 0, 'Cant transfer funds greater than balances of from account');
                return tokenInstance.transferFrom(fromAccount, toAccount, 20, {
                    from: spendingAccount
                });
            }).then(assert.fail).catch(function (error) {
                assert(error.message.indexOf('revert') >= 0, 'Cant transfer funds greater than balances of spenders account');
                return tokenInstance.transferFrom.call(fromAccount, toAccount, 2, {
                    from: spendingAccount
                });
            }).then(function (success) {
                assert.equal(success, true, "it returns true");
                return tokenInstance.transferFrom(fromAccount, toAccount, 10, {
                    from: spendingAccount
                });    
            }).then(function(receipt){
                assert.equal(receipt.logs.length, 1, "Triggers one event");
                assert.equal(receipt.logs[0].event,'Transfer', 'should be the transfer event');
                assert.equal(receipt.logs[0].args._from, fromAccount, 'logs account the token are transfered from');
                assert.equal(receipt.logs[0].args._to, toAccount, 'logs account the token are transfered to');
                assert.equal(receipt.logs[0].args._value, 10, 'logs token are transfered');
                return tokenInstance.balanceOf(fromAccount);
            }).then(function(balance){
                assert.equal(balance.toNumber(), 90, 'The balance fromAccount is perfectly deducted');
                return tokenInstance.balanceOf(spendingAccount);
            }).then(function(balance){
                assert.equal(balance.toNumber(), 0, 'The balance spendingAccount is perfectly deducted');
                return tokenInstance.balanceOf(toAccount);
            }).then(function(balance){
                assert.equal(balance.toNumber(), 10, 'The balance toAccount is perfectly added');
            });
        });
    });
});

//.call will not create any transaction while
// directing calling the function will result in the transactions