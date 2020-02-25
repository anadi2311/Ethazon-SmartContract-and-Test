//set up: define inital state
//act: where we actually test the code
//assert: check the results

const Ethazon = artifacts.require("Ethazon");
require('chai')
.use(require('chai-as-promised'))
.should();



contract("Ethazon", (accounts) => {
    let [deployer,customer1,customer2] = accounts;

    let contractInstance;
    
    beforeEach(async () =>{
        contractInstance = await Ethazon.deployed()
    })

    describe("Correct deployment", async () =>{
        it("should return OrderCost", async () => {
            //const contractInstance = await BookAppointment.deployed();
            const result1 = await contractInstance.orderCost();
            const address = await Ethazon.address;
            assert.equal(result1 , 2 );
            assert.notEqual(address,0x0);
            assert.notEqual(address,"");
            assert.notEqual(address,null);
            assert.notEqual(address,undefined);
            //assert.equal(result.appointments[1], Appt1);
        })
    })

    describe('Creating and Cancelling Orderes', async () => {

        //don't forget to add await in front of contract instance or it won't read the event

        it("should create Order if name and address given", async () => {
            result = await contractInstance.createOrder( "Anadi", "Vancouver", {from: customer1, value: 2});
            const event = result.logs[0].args;
            // id pushes starts with 1. go to remix to check
            assert.equal(event.OrderId.toNumber(), 1,"Order Id is right");
            //ask for contract instance use
            assert.equal(event.customerName, "Anadi","Name is right!");
            assert.equal(event.shipmentAddress,"Vancouver", "Address is right");
        })

        it("should not confirm invalid order", async () => {
            // orderId 2 is not valid because it was never created
            // //isValidEthazonOrder is false
            // in this case it should be rejected
            await contractInstance.confirmOrder( 2, {from: customer1}).should.be.rejected;
                    })
        
        it("should not cancel confirmed order", async () => {
            // although orderId in event starts logging with 1
            // in data base first order is of 0th number
            confirm = await contractInstance.confirmOrder(0, {from:customer1})
            await contractInstance.cancelOrder(0,{from:customer1}).should.be.rejected;

        }) 
        // use x in front of "it" to make it pending

        it("should not make order with insufficient order cost", async () => {
            //used patient2 because patient 1 already created the appointment in result above
            // using patient2 so that value can be checked
            await contractInstance.createOrder( "EECE", "CPSC", {from: customer1, value: 1}).should.be.rejected;
                    })

        it("should be able to cancel only your own appointment", async () => {
            customerOldBalance = await web3.eth.getBalance(customer1);
            await contractInstance.cancelOrder(0, {from: customer2}).should.be.rejected;
            cancel = await contractInstance.cancelAppointment(0, {from: patient1});

        // why cancel is false?    
            assert.equal(cancel.receipt.status, true);
        })

        it("should not make new orderbefore cancelling exisiting", async () => {
            // customer 2 will make an order
            // customer 2 will not confirm and make another
            await contractInstance.createAppointment( 1212, 1210, {from: patient2, value: 1}).should.be.rejected;
                    })

        it("check if cancelled", async() => {
            count = await contractInstance.patientApptCount(patient1);
            assert.equal(count,0);

            patientNewBalance = await web3.eth.getBalance(patient1);
            const gasUsed = cancel.receipt.gasUsed;
            const expectedBalance = patientOldBalance + contractInstance.apptCost()-gasUsed;

            assert.equal(expectedBalance,patientNewBalance);

        })
    })
    
    
    
})