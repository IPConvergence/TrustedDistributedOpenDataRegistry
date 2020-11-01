# Open Data Trusted Anchors (ODTA) - Project

Project Context:

Today on the current used Internet model, we are massively overloaded by Data Asset we don't know where they come from, if we can trust the source and if we can trust the integrity ot the data.

The future Web version will be a web of trust, where information will have proof of source authenticity, proof of integrity of the information itself, will be open and available for all at world scale, will be easily understood by machine (Semantic Web Envelop needed around Bruto Data Asset). We will see a new area where Data Asset will be exchanged between Data Asset Producers and Consumers with a very high level of quality and trust enabling new world wilde decentralized trusted quality business model, enabling to solve the biggest problems on the plannet, like helping on climate change, improving research on disease...

In order to deliver that promise we will need to have the following building blocks:
- Big Open Data: to produce and share large amount of open Data Asset available to all
- Semantic Web envelopp on all asset: to enable easy understanding of the Data Asset by all machines and enable easy world wide interoperability on them
- Ledger Technology: to deliver trusted anchors for the Open Data, enabling Data Producer and consumer to exchange and consume Open Data on a trusted way, without any central authority or censhorship entities
- AI: To run "Solving Problem" algorithm on trusted Open Data and delivering Trusted Solutions

Project Scope:

The purpose of this project is to deliver a Trusted Anchor Registry for Open Data available at World Scale.
This registry will be used by Open Data Producers to anchor for each Open Data Asset they produce, proof of Source authenticity and proof of Data Integrity, plus specify the conditions under which the data can be consumed (the contractual agreement). Each Open Data Asset will catch in his Semantic Web Envelop a link to that Open Data Trusted Anchor registry where the Source Authenticity, the Integrity and consuming contractual agreeement is stored. Data Consumer will consume the Trusted Open Data and will be able to validate the Meta Data Trust information present on the semanic Web envelop of the Trusted Data and will query the Open Data Trusted Anchors to verify the Proof of Source Authenticity, the Proof of Integrity, and the proof of the contractual agreement of published data by produce.


Consumer Business Cases would be:

Trustworthy Open Data coming from the Health Sector for disease research (like cancer, Covid19 Analytics...)
Trustworthy Open Data coming from the world climate parameter (CO2 level, Temperature...)
Trustworthy Open Data coming from green energy (to monitor the growing adoption of green energy on the different region of the world and show compliancy with)
Trustworthy Open Data coming from academical research.

User Stories:

Story 1: In order to deliver a "Proof of Source Authenticity" on a Data Asset I have produced, as a <Data Producer Entity>, I publish on the ODTA Registry the Proof of Source Authenticity of the Data Asset.

Story 2: In order to deliver a "Proof of Integrity" on a Data Asset I have produced, as a <Data Producer entity>, I publish on the ODTA Registry the Proof of Integrity of the Data Asset.

Story 3: In order to publish "Use and Processing Terms and conditions" on a Data Asset I have produced, as a <Data Producer> Entity, I publish on the ODTA Registry the Proof of the Integrity of the "Use and Processing" Terms and conditions contract.

Story 4: In order to setup the "Data Access Conditions" on a Data Asset I have produced, as a <Data Producer>, I publish on the ODTA Registry the "Data Access Conditions" to setup the access control on the published Data

Story 5: In order to validate the "authenticity of the source" that produce the Data Asset I receive, as a <Data Consumer> Entity, I query the ODTA Registry to validate the authenticity of the Data Asset source.

Story 6: In order to validate the "integrity of the Data Asset" I receive, as a <Data Consumer> Entity, I query the ODTA Registry to validate the authenticity of the Data Asset.

Story 7: In order to validate the "Use and Processing Terms and conditions" to the Open Data Asset (present in the Semantic Web Envelop Received), as a <Data Consumer> Entity, I query the ODTA Registry to validate the Integrity of the "Use and Processing Terms and conditions" to the Data Asset (Free or specific Access Cost conditions, intellectual property rights...)

Story 8: In order to "give access to a paid-access Data Asset" I produce to a specific <Data Consumer>, as a <Data Producer Entity>, I give the access to the Data Asset to the <Data Consumer>

Story 9: In order to "get access to a paid-access Data Asset" I received, as a <Data Consumer> Entity, I paid the fee to get access to the Data


Key Concept Definition:

- Proof of Authenticity: Signature done by a Data Publisher + Public key to verify it
- Proof of Integrity: Hash of the Data (including the Semantic web envelop)
- Use Terms and conditions: describe the authorized exploitation of the produced Data Asset, the intellectual property conditions on it, free or need to pay for access...
- Processing Terms and conditions: what a consumer can do with it: read only (not copy authorized), copy, free or pay before access
- Data Access Conditions: mechanisms put in place to protect special access to Data Asset, like paid-access.

The ODTA Registry will be composed of 3 Smart Contracts:
- ODTA Proxy Smart Contract
- ODTA Validator Smart Contract
- ODTA Access Control Smart Contract

For more information regarding the detail of the Data Model, Smart Contract design, Smart Contract Method signature, please refer to the https://marcantoine-lemaire.gitbook.io/solidity/open-data-trusted-anchors-project 