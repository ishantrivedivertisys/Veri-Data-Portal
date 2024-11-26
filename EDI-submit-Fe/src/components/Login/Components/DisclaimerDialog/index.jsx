import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";

const DisclaimerDialog = ({ visible, setVisible }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleCloseButtonClick = () => {
    if (isChecked) {
      setVisible(false);
    }
  };

  const footerContent = (
    <Grid
      container
      display={"flex"}
      direction={"row"}
      justifyContent={"end"}
      alignItems={"center"}
      marginRight={4}
      className="flex flex-row justify-content-end align-items-center gap-3 my-2"
    >
      <div className="flex justify-content-center gap-2 mx-2 mt-2">
        <FormControlLabel
          control={
            <Checkbox
              inputProps={{ "aria-label": "I Agree" }}
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
          }
          label="I Agree"
        />
      </div>
      <Button
        className="mt-2"
        variant="contained"
        sx={{ textTransform: "none" }}
        onClick={handleCloseButtonClick}
        autoFocus
        disabled={!isChecked}
      >
        Accept
      </Button>
    </Grid>
  );

  return (
    <div className="card flex">
      <Dialog
        open={visible}
        // onClose={() => setVisible(false)}
        PaperProps={{ className: "dialog-paper" }}
        scroll="paper"
        aria-labelledby="disclaimer-dialog-title"
        fullWidth
        maxWidth={"lg"}
        sx={{ paddingBottom: "20px" }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#def8ed",
            padding: "10px",
            paddingLeft: "24px",
            fontSize: "17px",
          }}
          alignItems={"center"}
          justifyContent={"start"}
          display={"flex"}
        >
          {<img src="./r-white.png" alt="logo" height={"30px"} />}
          <span
            style={{
              fontWeight: "bold",
              marginLeft: "10px",
              alignItems: "center",
            }}
          >
            Disclaimer
          </span>
        </DialogTitle>
        <DialogContent>
          <p className="mb-5" style={{ fontWeight: "bold", marginTop: "20px" }}>
            THE LEGAL AGREEMENT ("AGREEMENT") SET OUT BELOW GOVERNS YOUR USE OF
            RIEMERPLUS CANTALUPO & SHERMAN WEBSITE. TO AGREE TO THESE TERMS,
            CLICK "AGREE." IF YOU DO NOT AGREE TO THESE TERMS, DO NOT CLICK
            "AGREE," AND DO NOT USE THE SERVICE.
          </p>
          <p className="mb-5">
            Riemer Reporting Service is the provider of the commercial credit
            reports, which permits you to obtain reported credit information and
            data. The antitrust laws of the United States permit trade
            associations to establish facilities or services providing for
            lawful exchange of credit information with other interested parties
            and members. Decisions to this effect have been upheld by the
            Supreme Court of the United States. Participants of the credit
            interchange should be extremely careful to avoid concerted action,
            which may result in a decision not to sell customers. While the law
            permits members to exchange credit information participants must
            adhere to the following. Participants must not engage in any
            agreement or understanding, expressed or implied: to fix or
            determine to whom sales are to be made or credit is to be extended;
            to establish joint or uniform prices, discounts, terms, and
            conditions under which sales are to be made or credit is to be
            extended; to concertedly refuse to sell merchandise or extend credit
            to an account; to undertake any other activity jointly with respect
            to any account discussed before the association. All participants
            must make their own credit decisions based upon their individual
            standards of creditworthiness. No participant may plan, discuss
            with, or reveal, either explicitly or implicitly, any future actions
            or policies which might be taken by a participant individually with
            repect to prices, terms of sale, including credit policies as to
            late charges, discounts, allowances, or any other activity with
            respect to an account. No participant may exchange or collect
            information as to prospective prices, proposed credit policies and
            planned terms or conditions of sale. No participant may act in
            concert or agree with respect to any of the foregoing topics,
            whether at an official meeting of the association, through on-line
            corrospondence, or in private meetings before or after offical
            functions. It shall be the responsibility of each participant and of
            the Association to prevent and disallow the above activites.
            Meetings and on-line forums will be conducted in strict accord with
            the laws governing the exchange of credit information, and it is the
            responsibility of each participant to be thoroughly familliar and
            abide by those laws. Any violation of the above may be a per se
            violation of the antitrust laws and may expose participating members
            to criminal as well as civil penalties of the most stringent kind.
            Such action may even lead to the dissolution of RiemerPlus Cantalupo
            & Sherman. The information available through this Service is
            provided in strict confidence for legitimate credit reporting and
            only for business and independent use by you or your credit
            personnel. Confidentiality of the information available through this
            Service should be of the highest priority and must not be disclosed
            to any unauthorized parties including, but not limited to, yours or
            other members' customers.
          </p>
          <h4 className="font-bold">YOUR ACCOUNT</h4>
          <p className="mb-5">
            As a registered user of the Service, you may establish an account
            ("Account") in accordance with the Usage Rules, below. Don't reveal
            your Account information to anyone else. You are solely responsible
            for maintaining the confidentiality and security of your Account and
            for all activities that occur on or through your Account, and you
            agree to immediately notify RiemerPlus Cantalupo & Sherman of any
            security breach of your Account. RiemerPlus Cantalupo & Sherman
            shall not be responsible for any losses arising out of the
            unauthorized use of your Account.
          </p>
          <h4 className="font-bold">USAGE RULES</h4>
          <p className="mb-5">
            You agree to use the Service in compliance with usage rules
            including the Credit Interchange Program Guidelines and all
            applicable antitrust laws. RiemerPlus Cantalupo & Shermanreserves
            the right to modify the usage rules at any time. You are authorized
            to use the Service only for commercial use.{" "}
          </p>
          <p className="mb-5">
            You agree not to, or attempt or assist another person to, violate,
            circumvent, reverse - engineer, decompile, disassemble, or otherwise
            tamper with the Service.
          </p>
          <p className="mb-5">
            In addition you agree that you will NOT use the Service to: upload,
            download, post, email, transmit, store or otherwise make available
            any content that is unlawful, harassing, threatening, harmful,
            tortious, defamatory, libelous, abusive, violent, obscene, vulgar,
            invasive of another's privacy or rights, hateful, racially or
            ethnically offensive, or otherwise objectionable; stalk, harass,
            threaten or harm another in violation of law; engage in any
            copyright infringement or other intellectual property infringement,
            or disclose any trade secret or confidential information in
            violation of a confidentiality agreement; post, send, transmit or
            otherwise make available any unsolicited or unauthorized email
            messages; upload, post, email, transmit, store or otherwise make
            available any material that contains viruses or any other computer
            code, files or programs designed to harm, interfere with or limit
            the normal operation of the Service (or any part thereof), or any
            other computer software or hardware; interfere with or disrupt the
            Service, or any servers or networks connected to the Service, or any
            policies, requirements or regulations of networks connected to the
            Service (including any unauthorized access to, use or monitoring of
            data or traffic thereon); plan or engage in any illegal activity;
            and/or gather and store confidential information on any other users
            of the Service to be used in connection with any of the foregoing
            prohibited activities;
          </p>
          <h4 className="font-bold">PRIVACY</h4>
          <p className="mb-5">
            When you use some features of the Service, such as inviting other
            users to join the Service, participating in leader boards, or
            displaying status messages, the information you share is visible to
            other users and can be read, collected, or used by them. You are
            responsible for the information you choose to submit in these
            instances.
          </p>
          <h4 className="font-bold">SUBMISSIONS TO THE SERVICE</h4>
          <p className="mb-5">
            The Service may offer interactive features that allow you to submit
            materials (including links to third-party content). You agree that
            any use by you of such features, including any materials submitted
            by you, shall be your sole responsibility, shall not infringe or
            violate the rights of any other party or violate any laws,
            contribute to or encourage infringing or otherwise unlawful conduct,
            or otherwise be obscene or objectionable. You also agree that you
            have obtained all necessary rights and licenses to make such
            submissions. You agree to provide accurate and complete information
            in connection with your submission of any materials to the Service.
            You hereby grant RiemerPlus Cantalupo & Sherman a worldwide,
            royalty-free, non-exclusive license to use such materials as part of
            the Service or in providing or marketing the Service, without any
            compensation or obligation to you. RiemerPlus Cantalupo & Sherman
            reserves the right to not post or publish any materials and to
            remove or edit any materials, at any time in its sole discretion
            without notice or liability.
          </p>
          <p className="mb-5">
            RiemerPlus Cantalupo & Sherman has the right, but not the
            obligation, to monitor any materials submitted by you or otherwise
            available on the Service, to investigate any reported or apparent
            violation of this Agreement, and to take any action in its sole
            discretion it deems appropriate, including, without limitation,
            termination at will hereunder.
          </p>
          <h4 className="font-bold">THIRD-PARTY MATERIALS</h4>
          <p className="mb-5">
            Certain content and services available via the Service may include
            materials from third parties. RiemerPlus Cantalupo & Sherman may
            provide links to third-party web sites as a convenience to you. You
            agree that RiemerPlus Cantalupo & Sherman is not responsible for
            examining or evaluating the content or accuracy and RiemerPlus
            Cantalupo & Sherman does not warrant and will not have any liability
            or responsibility for any third-party submitted data, materials or
            web sites, or for any other materials, products, or services of
            third parties. You agree that you will not use such materials in a
            manner that would infringe or violate the rights of any other party
            and that RiemerPlus Cantalupo & Sherman is not in any way
            responsible for any such use by you.
          </p>
          <h4 className="font-bold">INTELLECTUAL PROPERTY</h4>
          <p className="mb-5">
            You agree that the Service, including but not limited to graphics,
            user interface, audio clips, video clips, editorial content, and the
            scripts and software used to implement the Service, contains
            proprietary information and material that is owned by RiemerPlus
            Cantalupo & Sherman and/or its licensors, and is protected by
            applicable intellectual property and other laws, including but not
            limited to copyright. You agree that you will not use such
            proprietary information or materials in any way whatsoever except
            for use of the Service in compliance with this Agreement. No portion
            of the Service may be reproduced in any form or by any means, except
            as expressly permitted in these terms. You agree not to modify,
            rent, lease, loan, sell, distribute, or create derivative works
            based on the Service, in any manner, and you shall not exploit the
            Service in any unauthorized way whatsoever, including, but not
            limited to, by trespass or burdening network capacity.
          </p>
          <p className="mb-5">
            Notwithstanding any other provision of this Agreement, RiemerPlus
            Cantalupo & Sherman and its licensors reserve the right to change,
            suspend, remove, or disable access to any content, or other
            materials comprising a part of the Service at any time without
            notice. In no event will RiemerPlus Cantalupo & Sherman be liable
            for making these changes. RiemerPlus Cantalupo & Sherman may also
            impose limits on the use of or access to certain features or
            portions of the Service, in any case and without notice or
            liability. The use of the software or any part of the service,
            except for use of the service as permitted in this Agreement, is
            strictly prohibited and may subject you to civil and criminal
            penalties, including possible monetary damages.
          </p>
          <p className="mb-5">
            RiemerPlus Cantalupo & Sherman, the RiemerPlus Cantalupo & Sherman
            logo, and its other trademarks, service marks, graphics, and logos
            used in connection with the Service are trademarks or registered
            trademarks of RiemerPlus Cantalupo & Sherman. Other trademarks,
            service marks, graphics, and logos used in connection with the
            Service may be the trademarks of their respective owners. You are
            granted no right or license with respect to any of the aforesaid
            trademarks and any use of such trademarks.
          </p>
          <h4 className="font-bold">TERMINATION</h4>
          <p className="mb-5">
            If you fail to comply with any of the provisions of this Agreement,
            no longer meet the eligibility requirements of the RiemerPlus
            Cantalupo & Sherman's Credit Interchange Program, or have a conflict
            of interest as determined by RiemerPlus Cantalupo & Sherman,
            RiemerPlus Cantalupo & Sherman, at its sole discretion, without
            notice to you may: (i) terminate this Agreement and/or your Account;
            and/or (ii) terminate the license to the Service; and/or (iii)
            preclude access to the Service (or any part thereof). RiemerPlus
            Cantalupo & Sherman reserves the right to modify, suspend, or
            discontinue the Service (or any part or content thereof) at any time
            with or without notice to you, and RiemerPlus Cantalupo & Sherman
            will not be liable to you or to any third party should it exercise
            such rights.
          </p>
          <h4 className="font-bold">
            DISCLAIMER OF WARRANTIES; LIABILITY LIMITATION
          </h4>
          <p className="mb-5">
            RiemerPlus Cantalupo & Sherman does not guarantee, represent, or
            warrant that your use of the service will be uninterrupted or
            error-free, and you agree that from time to time it may remove the
            service for indefinite periods of time, or cancel the service at any
            time, without notice to you.
          </p>
          <p className="mb-5">
            You expressly agree that your use of, or inability to use, the
            service is at your sole risk. The service and all products and
            services delivered to you through the service are (except as
            expressly stated herein) provided "as is" and "as available" for
            your use, without warranties of any kind, either express or implied,
            including all implied warranties of merchantability, fitness for a
            particular purpose, title, and noninfringement. In no case shall
            RiemerPlus Cantalupo & Sherman, its directors, officers, employees,
            affiliates, agents, contractors, or licensors be liable for any
            direct, indirect, incidental, punitive, special, or consequential
            damages arising from your use or inability to use the service or for
            any other claim related in any way to your use of the service,
            including, but not limited to, any errors or omissions in any
            content, or any loss or damage of any kind incurred as a result of
            the use of any content (or product) posted, transmitted, or
            otherwise made available via the service.
          </p>
          <p className="mb-5">
            You agree that your submission of such information is at your sole
            risk, and RiemerPlus Cantalupo & Sherman hereby disclaims any and
            all liability to you for any loss or liability relating to such
            information in any way.
          </p>
          <p className="mb-5">
            RiemerPlus Cantalupo & Sherman does not represent or guarantee that
            the service will be free from loss, corruption, attack, viruses,
            interference, hacking, or other security intrusion, and Riemer
            Reporting Service disclaims any liability relating thereto.
          </p>
          <h4 className="font-bold">WAIVER AND INDEMNITY</h4>
          <p className="mb-5">
            By using the service, you agree to indemnify and hold RiemerPlus
            Cantalupo & Sherman, its directors, officers, employees, affiliates,
            agents, contractors, and licensors ("RiemerPlus Cantalupo & Sherman
            parties") harmless with respect to any claims arising out of your
            breach of this Agreement, your use of the service, or any action
            taken by RiemerPlus Cantalupo & Sherman parties as part of its
            investigation of a suspected violation of this Agreement or as a
            result of its finding or decision that a violation of this Agreement
            has occurred. This means that you cannot sue and hereby irrevocably
            waive rights to recover any damages from RiemerPlus Cantalupo &
            Sherman parties as a result of its decision to remove or refuse to
            process any information or content, to warn you, to suspend or
            terminate your access to the service, or to take any other action
            during the investigation of a suspected violation or as a result of
            RiemerPlus Cantalupo & Sherman's conclusion that a violation of this
            Agreement has occurred. This waiver and indemnity provision applies
            to all violations described in, resulting from, or contemplated by
            this Agreement or under law or equity.
          </p>
          <h4 className="font-bold">CHANGES</h4>
          <p className="mb-5">
            RiemerPlus Cantalupo & Sherman reserves the right at any time to
            modify this Agreement and to impose new or additional terms or
            conditions on your use of the Service. Such modifications and
            additional terms and conditions will be effective immediately and
            incorporated into this Agreement. Your continued use of the Service
            will be deemed acceptance thereof.
          </p>
          <h4 className="font-bold">MISCELLANEOUS</h4>
          <p className="mb-5">
            This Agreement constitutes the entire agreement between you and
            RiemerPlus Cantalupo & Sherman and governs your use of the Service,
            superseding any prior agreements between you and RiemerPlus
            Cantalupo & Sherman regarding the Service. You also may be subject
            to additional terms and conditions that may apply when you use
            affiliate services, third-party content, or third-party software. If
            any part of this Agreement is held invalid or unenforceable, that
            portion shall be construed in a manner consistent with applicable
            law to reflect, as nearly as possible, the original intentions of
            the parties, and the remaining portions shall remain in full force
            and effect. RiemerPlus Cantalupo & Sherman's failure to enforce any
            right or provisions in this Agreement will not constitute a waiver
            of such or any other provision. RiemerPlus Cantalupo & Sherman will
            not be responsible for failures to fulfill any obligations due to
            causes beyond its control. You agree to comply with all local,
            state, federal, and national laws, statutes, ordinances, and
            regulations that apply to your use of the Service . All transactions
            on the Service are governed by Ohio state law, without giving effect
            to its conflict of law provisions. Your use of the Service may also
            be subject to other laws. You expressly agree that exclusive
            jurisdiction for any claim or dispute with RiemerPlus Cantalupo &
            Sherman or relating in any way to your use of the Service resides in
            the courts of the State and County of Ohio. Risk of loss and title
            for all electronically delivered transactions pass to the purchaser
            upon electronic transmission to the recipient. No RiemerPlus
            Cantalupo & Sherman employee or agent has the authority to vary this
            Agreement.
          </p>
          <p className="mb-5">
            RiemerPlus Cantalupo & Sherman may send you notice with respect to
            the Service by sending an email message to your Account email
            address or a letter via postal mail to your Account mailing address,
            or by a posting on the Service. Notices shall become effective
            immediately.
          </p>
          <p className="mb-5">
            RiemerPlus Cantalupo & Sherman reserves the right to take steps it
            believes are reasonably necessary or appropriate to enforce and/or
            verify compliance with any part of this Agreement. You agree that
            RiemerPlus Cantalupo & Sherman has the right, without liability to
            you, to disclose information to law enforcement authorities,
            government officials, or under Court Order, as it believes is
            reasonably necessary or appropriate to enforce and/or verify
            compliance with any part of this Agreement.
          </p>
        </DialogContent>
        <DialogActions>{footerContent}</DialogActions>
      </Dialog>
    </div>
  );
};

export default DisclaimerDialog;
