(function () {
    'use strict';

    angular.module('todo.shared.constants')

        .constant("SETTINGS", {
             API_URL: "https://store-mgt.herokuapp.com/",
            // API_URL: "http://208.113.130.132:3001/",
            //   API_URL: "http://208.113.130.32:3001/",
            // API_URL: "http://localhost:3001/",
            storage: {
                userSessionToken: "userSessionToken",
                userDetails: "userDetails"
            },
            VENDOR_STANDARD : "57c0596e20a1d133e4eaf886",
            MATERIAL_CONSUM : "57c0596e20a1d133e4eaf887",
            MATERIAL_RETURN : "57c0596e20a1d133e4eaf888",
            MATERIAL_CONSUM_NAME : "Consumable",
            MATERIAL_RETURN_NAME : "Returnable",
            INTERNET_DISCONNECTED: "Internet disconnected try again",
            "mr_status": [
                {
                    "_id": "57444c9569f12a253c61bc9a",
                    "name": "Pending",
                    "status": "true",
                    "color": "flgPending"
                },
                {
                    "_id": "574450f469f12a253c61bca0",
                    "name": "Approved",
                    "status": "true",
                    "color": "flgApprove"
                },
                {
                    "_id": "574450f469f12a253c61bca1",
                    "name": "Rejected",
                    "status": "true",
                    "color": "flgReject"
                },
                {
                    "_id": "574450f469f12a253c61bca2",
                    "name": "Closed",
                    "status": "true"
                },
                {
                    "_id": "574450f469f12a253c61bca3",
                    "name": "Draft",
                    "status": "true"
                },
                {
                    "_id": "574450f469f12a253c61bca4",
                    "name": "Delete",
                    "status": "true"
                },
                {
                    "_id": "574450f469f12a253c61bca5",
                    "name": "Accepted",
                    "status": "true"
                }
            ],
            "mi_status": [
                {
                    "_id": "57444c9569f12a253c61bc9a",
                    "name": "Closed",
                    "status": "true",
                    "color": "flgPending"
                },
                {
                    "_id": "574450f469f12a253c61bca1",
                    "name": "Not Issued",
                    "status": "true",
                    "color": "flgReject"
                },
                {
                    "_id": "574450f469f12a253c61bca2",
                    "name": "Issued",
                    "status": "true",
                    "color": "flgApprove"

                },
                // {
                //     "_id": "574450f469f12a253c61bca3",
                //     "name": "Closed",
                //     "status": "true"
                // },
                {
                    "_id": "574450f469f12a253c61bca4",
                    "name": "Delete",
                    "status": "true"
                },
                {
                    "_id": "576a5c81bd7ebf2facf2de81",
                    "name": "Rejected",
                    "status": "true"
                },
                {
                    "_id": "5788c73ac49a4527acb23ba9",
                    "name": "Manual Closed",
                    "status": "true"
                },
                {
                    "_id": "578fde1f3d4dce0370afed4a",
                    "name": "Partially Issued",
                    "status": "true"
                },
                {
                    "_id": "578fde1f3d4dce0370afed4b",
                    "name": "Approved",
                    "status": "true"
                }
            ],
            "pi_status": [
                {
                    "_id": "57444c9569f12a253c61bc9a",
                    "name": "Pending",
                    "status": "true"
                },
                {
                    "_id": "574450f469f12a253c61bca1",
                    "name": "Rejected",
                    "status": "true"
                },
                {
                    "_id": "574450f469f12a253c61bca2",
                    "name": "Approved",
                    "status": "true"
                },
                {
                    "_id": "574450f469f12a253c61bca3",
                    "name": "Draft",
                    "status": "true"
                },
                {
                    "_id": "574450f469f12a253c61bca4",
                    "name": "Delete",
                    "status": "true"
                },
                {
                    "_id": "5798aa10c04d8514e0db6cc6",
                    "name": "Closed",
                    "status": "true"
                }
            ],
            "po_status": [
                {
                    "_id": "57650efb818d3b1cd808c401",
                    "name": "Created",
                    "status": "true"
                },
                {
                    "_id": "57650efb818d3b1cd808c402",
                    "name": "Closed",
                    "status": "true"
                },
                {
                    "_id": "57650efb818d3b1cd808c403",
                    "name": "Deleted",
                    "status": "true"
                },
                {
                    "_id" : "578f673c3d4dce0370afed49", 
                    "name" : "Rejected", 
                    // "updatedDt" : ISODate("2016-08-30T19:21:48.415+0000"), 
                    "status" : "true"
        },
                {
                    "_id": "578f673c3d4dce0370afed48",
                    "name": "Manual Closed",
                    "status": "true"
                },
                {
                    "_id" : "57650efb818d3b1cd808c404", 
                    "name" : "Approved", 
                    "status" : "true"
        },
            ],
            "mrn_status": [
                {
                    "_id": "5767b0ec69f12a0e94baa70f",
                    "name": "Approved",
                    "status": "true"
                },
                {
                    "_id" : "57650efb818d3b1cd808c401", 
                    "name" : "Created", 
                    "status": "true"
                },
                {
                    "_id" : "5767b0ec69f12a0e94baa712", 
                    "name" : "Audited",  
                    "status" : "true"
        }, 
                // {
                //     "_id": "5767b0ec69f12a0e94baa710",
                //     "name": "Closed",
                //     "status": "true"
                // },
                
                {
                    "_id": "5767b0ec69f12a0e94baa711",
                    "name": "Rejected",
                    "status": "true"
                }
            ]
        })

})();