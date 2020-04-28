# Ethical and privacy implications of using large-scale smartphone data to monitor the spread of COVID-19 


> *“There is an understandable desire to marshal all tools that are at our disposal to help confront the pandemic, [...]. Yet countries’ efforts to contain the virus must not be used as an excuse to create a greatly expanded and more intrusive digital surveillance system.”* 
> 
> **Michael Kleinman, director of Amnesty International’s Silicon Valley Initiative**

## Introduction

The outbreak of the SARS-nCoV-2 virus --- responsible for the novel coronavirus disease of 2019 called COVID-19 --- has resulted in an ongoing global pandemic as of April 2020 that has infected more than 2 million people and kill over 125,000 people (as of April 15th 2020). In response to the pandemic, many countries have put in place draconian measures compelling entire populations to remain indoors under quarantine to help stop the spread, and enforcing social distancing measures in public places. Due to these measures we have seen substantial rises in telecommuting, and also an increase in unemployment as a result of economic strain on many industrial sectors. Despite all of these measures being put in place and their huge socioeconomic ramifications, people are still getting infected. One of the most effective methods for counteracting the spread of transmissible diseases is through contact tracing - using social networks to determine who an infected individual has recently been in contact with. Contact tracing allows connections of individuals that are hospitalized or test positive for the virus to be found. These individuals can then be quarantined or told to self-isolate for 14 days --- the suspected incubation period of the virus. Nowadays, contact tracing can be done using data extracted from the GPS module on a smartphone. 

Coronavirus applications are mobile applications designed to aid contact tracing with the intention of suppressing the COVID-19 disease. These applications have been implemented by multiple governments across the world in response to the pandemic. Applications of this form have thus so far been implemented by (1) the Chinese government, in conjunction with Alipay, across 200 Chinese cities [1]; (2) South Korea, with the Corona 100m application which notifies people of nearby cases [2]; (3) Singapore, an app called TraceTogether is being used3; and (4) Russia, a tracking app for patients diagnosed with COVID-19 living in Moscow, designed to ensure they do not leave home [3]. The United Kingdom’s NHSX, the government body responsible for policy regarding technology in the National Health Service (NHS), is also considering implementing a similar system that would alert people if they had recently been in contact with someone that has tested positive for COVID-19 [4], with a similar system planned to be implemented in Ireland [5]. These concerns have been amplified by new information that both Google and Apple are collaborating on a contact tracing application for iPhones and Android handsets, although the companies have stressed that the application will be anonymous and voluntary [6].

The hasty implementation of such systems in response to the rapid proliferation and severity of the pandemic has led many to overlook potential ethical and privacy implications of widespread monitoring of individuals using smartphone geolocation data. Until now, discussions have largely focused on hypotheticals, since most jurisdictions either implemented this technology with little public consultation or have much stronger privacy norms that make such measures politically infeasible [7]. But consumer advocates fear that an emphasis on health over privacy could undermine the protection of civil liberties, similar to what happened after 9/11, when the U.S. secretly began collecting mass amounts of data on its own citizens in an effort to track down terrorists.


In this project, we plan to address some of these implications and propose an implementation which provides sufficient utility to governments, business, healthcare services, and the public, whilst preserving the privacy of the individual.

## Background

This section provides an introduction to contact tracing and an overview of its implementation via the use of smartphones and other data-collecting devices. This also covers several discussion points which aim to provide an overview of current public perception on the technology. 

### Contact Tracing and Technology-Enabled Public Health

Contact tracing involves searching for individuals that have recently been in contact with another individual who has tested positive for a specific illness. By monitoring these individuals and possibly isolating them when they have been in contact with a highly contagious infection, the spread of a disease can be better controlled and preventative measures put in place. This process is outlined in detail graphically in Figure 1.

![](https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Contact-tracing_adapted.svg/1920px-Contact-tracing_adapted.svg.png)

**Figure 1:** Illustration of contact tracing process. Source: [Center of Disease Control](https://www.cdc.gov/vhf/ebola/pdf/contact-tracing.pdf).

Contact tracing has long been used in epidemiology, particularly for tuberculosis, measles, and sexually-transmitted infections. However, with the advent of smartphones and big data analytics, and increased interest in the topic due to the currently ongoing COVID-19 pandemic, there has been extensive interest in developing smartphone-based contact tracing schemes to monitor the spread of COVID-19.

The rapid development of these schemes by a multitude of sources including governments, organizations, academics, open-source projects, and hobbyists has resulted in numerous different implementations. In addition, these actors have varying incentives, as well as social, ethical, and moral values which may not be compatible, which may be reflected in their contact tracing schemes. In such an unprecedented time, ethical reviews of potentially life-saving technologies often take a back seat, leaving these incompatibilities unaddressed. Figure 2 demonstrates the rapidly increasing interest in contact tracing since the outbreak of the pandemic.

![](https://i.imgur.com/eIHo9hi.png)


**Figure 2:** News stories from January 1st to April 26th, 2020 mentioning "bluetooth" or "gps" in conjunction with "contact tracing" as well as "covid-19" or "coronavirus". Source: [Mediacloud](https://mediacloud.org/).

In addition to the platforms themselves, several concerns have been raised about the quality of the data obtained from such platforms. There are two types of platforms that have been proposed: Bluetooth-based contact tracing and Global Positioning System (GPS)-based contact tracing. Bluetooth-based contact tracing utilizes short-range Bluetooth communication between smartphones. Thus, signals are only sent if two people are within a certain proximity. However, if two individuals visit the same location but at different times, and the virus was transmitted through touch via a fomite, the bluetooth-based mechanism would not pick up on this transmission event. GPS-based methods utilizes smartphone geolocation data and do not suffer from this specific problem. Instead, the disadvantage of GPS is in its lower resolution than bluetooth. In addition to these issues, the time resolution of the data may not be sufficient to pick up on many transmission events. However, high-risk individuals are deemed to be those within 6 meters of eachother for 15 minutes or more, meaning that a time resolution of 15 minutes will likely pick up on the majority of cases.

These are just problems with the data collection itself. When we add in the human and social elements, more pernicious complications come into effect. For example, the individual who forgets to take their phone to the grocery store, or people living in remote locations that have limited access to cellular data or internet. There is also a significant portion of the population that do not have a smartphone, including a substantial proportion of elderly people --- those known to be at high risk if infected. Many of the systems are inherently consentual, including the disclosure to the system. If and when an individual contracts the disease, they still have the decision not to disclose this information for whatever reason. Lastly, the system inherently relies on the network effect --- the more people using the system, the more valuable the information it provides. If even a minor portion of the population choose not to use it, the system's utility is reduced.

On January 23rd 2020, the World Health Organization (WHO) designated coronavirus a Public Health Emergency of International Concern (PHEIC), which according to the WHO's International Health Regulations 2005, mandates reporting of cases. This necessity made a strong case for the development of national surveillance schemes, with several countries opting to produce smart bracelets to track individual's movements, such as Bahrain ([Mobi Health News](https://www.mobihealthnews.com/news/europe/bahrain-launches-electronic-bracelets-keep-track-active-covid-19-cases), 2020), South Korea ([Business Insider](https://www.businessinsider.com/south-korea-wristbands-coronavirus-catch-people-dodging-tracking-app-2020-4), 2020), as well as Belgium, Lichtenstein, Bulgaria, India, and Hong Kong ([BBC News](https://www.bbc.com/news/technology-52409893), 2020). Some of these schemes are mandatory, and fines can be given to people without their bracelets. Some states are forcing citizen's not abiding by social distancing rules to wear these bracelets. Apple and Google have been in collaboration on a bluetooth-based contact tracing system, which is planned for release in early May 2020. Both companies have said that the system is optional and will require downloading an application from the Apple Store or Google Play Store. However, the companies have mentioned that phase 2 of their implementation would involve embedding this information into the operating systems of iPhones and Android devices, making it difficult, if not impossible, to opt out. Concerns have been raised by privacy advocates and organizations warning that any statewide surveillance programs implemented as a result of the coronavirus epidemic must be retracted once the pandemic has dissipated. In some nations, emergency powers have been granted to allow this due to the unprecedented times, and some have exemptions covered in data protection and privacy laws for this kind of eventuality ([Privacy International](https://privacyinternational.org/examples/tracking-global-response-covid-19), 2020). However, in our need for safety and security, we run the risk of a transgression of civil liberties, which at its extreme could push us further towards an Orwellian surveillance state reminiscent of 1984's 'Big Brother'.  

#### Bluetooth-based Contact Tracing

![](https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fd6c748xw2pzm8.cloudfront.net%2Fprod%2F63ce8a60-8256-11ea-aaf1-b3952da6d847-standard.png?fit=scale-down&quality=highest&source=next&width=700)

#### GPS-based Contact Tracing

#### Hybrid Contact Tracing

As discussed previously, both schemes have advantages and disadvantages. By collecting both bluetooth and geolocation data, most of these disadvantages are eliminated. The accuracy of bluetooth is able to be leveraged, as well as the point-specific locations provided by geolocation data. Thus, the low-resolution of geolocation data and the problem of missing transmission via fomites is reduced, making the system overall more effective. The downside of this is that twice as much data is being collected, which presents more ethical and privacy concerns. However, this has not stopped this methodology from being introduced. Utah developed an application called 'Healthy Together' which tracks geolocation data as well as bluetooth information, which has been criticized by the ACLU and the Electronic Frontier Foundation for going beyond whast is necessary for effective contact tracing ([Quartz](https://qz.com/1843418/utahs-new-covid-19-contact-tracing-app-will-track-user-locations/), 2020).

* https://science.sciencemag.org/content/368/6487/145.2
* https://discoveries.childrenshospital.org/mobile-location-data-covid-19
* https://www.lightbluetouchpaper.org/2020/04/12/contact-tracing-in-the-real-world/

### Ethical principles

#### Ethics of this work

* https://www.wired.com/story/dropbox-sharing-data-study-ethics/

#### ACM code

* https://www.acm.org/code-of-ethics

#### Belmont & Menlo Reports

* https://www.hhs.gov/ohrp/sites/default/files/the-belmont-report-508c_FINAL.pdf

### Re-identification

An obvious first step toward protecting privacy is to remove all clear identifying information about individuals, such as names or phone numbers or other personally identifying information (PII), from data before release. Yet it can still be relatively easy to associate sensitive records in an anonymous dataset with an individual's identity. In her paper, "Simple Demographics Often Identify People Uniquely" [9], Latanya Sweeney demonstrated that it was possible to associate anonymised medical records with names on voter rolls using just an individual's X, Y, and Z.

Re-identification of anonymised data can be made possible through the clever use of "quasi-identifiers". In contrast with "direct identifiers" (variables that on their own can identify an individual, such as their name), quasi-identifiers are variables that can serve as a "bridge" between sensitive attributes in an anonymised dataset and directory information in a non-anonymised dataset.

![](https://i.imgur.com/pZyp4dw.png)

**Fig. 1 from Sweeney et al., 2000:** A dataset with sensitive attributes, such as an individual's medical diagnosis and medication, could be connected to a dataset with their name and address by cross-referencing their ZIP code, birth date, and sex.

#### K-anonymity and L-diversity

#### Differential privacy

### Ethical precautions taken in this project

Abide by Menlo specification and ACM code of ethics.


Although our experiments involve looking at how records in a geolocation dataset can be potentially re-identified, we will not be re-identifying or singling out any individual in the dataset. Rather, we will be designing algorithms that can provide aggregate statistics about the privacy of the dataset after processing through a pipeline. Thus, we only see summary statistics about re-identification potential.

Data were stored on the AWS Data Exchange and securely accessed using `boto3`, AWS's Python API. To pull data from AWS, a one-time URL was generated that lasted for one minute, after which it was no longer valid. No granual location data were stored locally.

## Data Sources

There are a variety of public and private organizations that have begun offering location datasets so that businesses or non-profits can conduct their own research in the context of COVID-19. In this section, we briefly survey some of these data providers.

### COVID-19 Applications

### Private and non-profit data providers

### Non-app governmental tracking

![Radial charts of all the initiatives]()

![Map of the initiatives]()

## Methods

In addition to the qualitative survey of the data above, we also explore several exemplary datasets relating to COVID-19 and location tracking. These datasets were either publicly available or graciously and securely provided to us by the company.

*Explain each data set and how the data are collected*

**X-Mode Social**

**Unacast**

**Opendemic**

**Cuebiq**(?)

**Reveal Mobile**(?)

To determine the potential public health benefits and privacy costs of using these kinds of data in the context of COVID-19, we will perform the following experiments:

### Public health benefits

1. Social distancing assessment

State and local governments have implemented various measures designed to encourage or mandate social distancing in an effort to stem the spread of COVID-19 and "flatten the curve". It is important to know if current measures are working and to be able to discover pockets of high density in a timely manner.

We assess the utility of the data for assessing social distancing using the following dimensions:

* Temporal resolution: how frequently is the data captured?
* Geographic resolution: how accurate are the location estimates?

**Experiment:**

a) Aggregate data at the state, county, municipality, or ZIP code level
b) For each level of aggregation, for each day, count the number of times that two users are within distance $d$ of one another within time frame $\Delta t$
c) Plot the change in close contact over time, overlayed with various state orders to stay at home or shelter in place
d) Examine trends to see if tiny fluctuations can be attributed to genuine signal or just noise

2. Contact tracing

* Proximity: Do the data give acceptably fine-grained measures of proximity? Given the uncertainty, how accurate are the contacts likely to be?
* Comparison to real-world estimates: given best estimates of the average number of infections/contacts per person, are we able to recover this number via simulations?

**Experiment:**

1. For city $c$ in $C$ (array of cities), filter to keep only the rows whose lat/lon fall within $c$
2. Based on the prevalence of COVID-19 in $c$, randomly assign each unique `advertiser_id` to be COVID-positive with probability $p$ on day $t$
3. From days $t-14$ to $t$, for advertiser_id $i$, find all other advertiser_id's $j$ such that $i$ and $j$ were within distance $d$ of each other (likely 6 feet)
    a. Repeat for varying levels of $d$
4. Compare the number of contacts found per COVID-positive person with the general estimates for contacts-per-person in the real world
    5. Compute the discrepancy (% difference)

### Privacy costs

* What is the probability that an individual could be re-identified from the anonymised data?

1. Identifying frequent visits

* A great deal can be learned about someone based on spots that they frequent. E.g. someone's home or place of work.

**Experiment:**

a) For each user, count the number of unique timestamped geolocation records
b) If there are any records on separate days that are within distance $\Delta d$, flag those as possible hotspots
c) Count the number of days where the user visits the main hotspots and report as a percentage (i.e. the percentage of days when the user visited a given spot)
d) Compute the number of users who have a hotspot they visit on p% of all days, for varying $p$

2. Identifying low-frequency areas

* Many visits are likely attributable to high-traffic hotspots with low information gain. E.g. train stations or busy office buildings. Looking at repeat visits to low-frequency areas might be particularly insightful.

**Experiment:**

a) For city c, divide the geographic area into cells and sum up the number of records per day in each cell
b) Classify as "high-traffic" all spots with greater than $n$ records per day
c) Repeat the first hotspot experiment, excluding all locations that are classified as "high frequency"

## Results

*See Jupyter Notebook*

## Discussion

There are implementations of contact tracing using smartphones that omit the need for geolocation data. The implementation by Apple and Google uses low energy bluetooth --- which has a range of around 10m --- to exchange anonymous identifiers which are picked up by anyone who has the application on their smartphone [6]. These identifiers change often and do not contain any location data. If one of the two people later contracts COVID-19 --- and is diagnosed and positively tested --- they enter this information in the Public Health Authority’s application. Then, providing the user consents, the last two weeks’ of beacons are sent to the server. The final stage in the process is that the phones that have come into contact with the now-diagnosed user receive an alert. This tells them they’ve come into contact with someone with the disease, with instructions on how to seek more information. The procedure for this is outlined in Figure 1.

<img src="https://fscl01.fonpit.de/userfiles/7682239/image/apple-google-corona-tracking-1-w782.jpg" alt="beautiful image" width="720">

<img src="https://media.wired.com/photos/5e90b404b9399f00096a2b7e/master/w_1600%2Cc_limit/COVID-19-Contact-Tracing-Press-Briefing-7.jpg" alt="beautiful image" width="720">

**Figure 1.** Contact tracing scheme by Google. Source: [Google](https://9to5google.com/2020/04/10/google-apple-covid-19-tracing/).

Of course, everyone needs to have the app on their phone for this to work. However, in phase 2 of Google and Apple's approach, the tracing functionality is built in without the need to download an app. With contact tracing, a certain proportion of users need to have the function on their phone for it to work. Take away the need to download the app and you’ve overcome a bump in the road. Nonetheless, both companies made clear that at every point, there is privacy and complete user control.

Both companies are heavily focused on the privacy angle. Key points they raised show that the system abides by the four ethical principles outlined in the [2012 Menlo Report](https://www.dhs.gov/sites/default/files/publications/CSD-MenloPrinciplesCORE-20120803_1.pdf) [8]:

- Explicit user consent required (**Respect for Persons**)
- Doesn’t collect personally identifiable information or user location data (**Beneficience**)
- List of people you’ve been in contact with never leaves your phone (**Respect for Persons**)
- People who test positive are not identified to other users, Google, or Apple (**Justice, Respect for Persons**)
- Will only be used for contact tracing by public health authorities for COVID-19 pandemic management (**Respect for Law and Public Interest**)

Apple and Google released draft technical documentation about the Bluetooth and cryptography specifications and framework needed for COVID-19 contact tracing for further transparency:

[Privacy-safe contact tracing using Bluetooth Low Energy](https://www.blog.google/documents/57/Overview_of_COVID-19_Contact_Tracing_Using_BLE.pdf)
[Contact Tracing Bluetooth Specification](https://www.blog.google/documents/54/Contact_Tracing_-_Bluetooth_Specification.pdf)
[Contact Tracing Cryptography Specification](https://www.blog.google/documents/56/Contact_Tracing_-_Cryptography_Specification.pdf)

The ACLU stated the Google and Apple's approach "appears to mitigate the worst privacy and centralization risks, but there is still room for improvement" ([ACLU](https://www.aclu.org/press-releases/aclu-comment-applegoogle-covid-19-contact-tracing-effort), 2020).


## Conclusion

The COVID-19 pandemic has purportedly reached its peak in several countries, with some governments beginning to ease restrictions. However, it has become increasingly clear that the virus will remain with us for many months, potentially years or indefinitely. Using location data to help governments track and quickly respond to new infections and flare-ups has drawn much attention as one potential solution. However, we have shown that .... Therefore, we caution...

These systems cannot be effective if people do not trust them. People will only trust these systems if they protect privacy, remain voluntary, and store data on an individual's device, not a centralized repository. The bluetooth-based privacy-preserving system developed by Google and Apple has been given the green light by the ACLU, but they caution that there is still room for improvement. That being said, they are far less invasive than schemes involving any form of geolocation data.


References
---
Mehta, Ivan (2020-03-03). "China's coronavirus detection app is reportedly sharing citizen data with police". The Next Web. Retrieved 2020-04-01.

Dudden, Alexis; Marks, Andrew (2020-03-20). "South Korea took rapid, intrusive measures against Covid-19 – and they worked". The Guardian. ISSN 0261-3077. Retrieved 2020-04-01.

Kelion, Leo (2020-04-01). "Moscow coronavirus app raises privacy concerns". BBC News. Retrieved 2020-04-01.

Kelion, Leo (31 March 2020). "UK considers virus-tracing app to ease lockdown". Retrieved 2020-04-01 – via www.bbc.co.uk.

Gorey, Colm (2020-03-30). "HSE announces coronavirus contact-tracing app, but privacy concerns remain". Silicon Republic. Retrieved 2020-04-01.

Phelan, David (2020-04-14). "COVID-19: Google And Apple Reveal More Intriguing Details Of Contact-Tracing". Retrieved 2020-04-15. [Link](https://www.forbes.com/sites/davidphelan/2020/04/14/covid-19-google-and-apple-reveal-more-intriguing-details-of-contact-tracing/#3f212a593d20)

Oliver, Nuria (2020-03-26). “Mobile phone data and COVID-19: Missing an opportunity?”. Preprint. Retrieved 2020-04-02. https://arxiv.org/pdf/2003.12347.pdf.

E. Kenneally and D. Dittrich, "The Menlo Report: Ethical Principles Guiding Information and Communication Technology Research", Tech. Report., U.S. Department of Homeland Security, Aug 2012. [Link](https://www.dhs.gov/sites/default/files/publications/CSD-MenloPrinciplesCORE-20120803_1.pdf).

Sweeney, L. (2000). Simple demographics often identify people uniquely. Health (San Francisco), 671, 1-34. [Link](http://ggs685.pbworks.com/w/file/fetch/94376315/Latanya.pdf)

Privacy International  (2020-04). Tracking the Global Response to COVID-19. Retrieved 2020-04-26 via [link](https://privacyinternational.org/examples/tracking-global-response-covid-19).

McArthur, Rachel (2020-04-08). Bahrain launches electronic bracelets to keep track of active COVID-19 cases. Retrieved 2020-04-26 via [link](https://www.mobihealthnews.com/news/europe/bahrain-launches-electronic-bracelets-keep-track-active-covid-19-cases).

Bostock, Bill (2020-04-11). South Korea launched wristbands for those breaking quarantine because people were leaving their phones at home to trick government tracking apps. Retrieved on 2020-04-28 via [link](https://www.businessinsider.com/south-korea-wristbands-coronavirus-catch-people-dodging-tracking-app-2020-4).

BBC News, 2020-04-24. Coronavirus: People-tracking wristbands tested to enforce lockdown. Retrieved on 2020-04-26 via [link](https://www.bbc.com/news/technology-52409893).

Khalid, Amrita (2020-04-23). Utah’s new Covid-19 contact tracing app will track user locations. Retrieved on 2020-04-27 via [link]( https://qz.com/1843418/utahs-new-covid-19-contact-tracing-app-will-track-user-locations/).