/* Vigyan Atlas — label function notes. window.VA_FN(name) -> one-line "what it does" (or ""). Keys are matched ignoring case, brackets and punctuation. "a/b|text" = aliases. */
(()=>{"use strict";
const RAW=`
nucleus|Control centre: holds DNA and directs growth, repair and division.
mitochondria/mitochondrion|Powerhouse: burns glucose with O₂ to release ATP energy.
endoplasmic reticulum|Network of channels that makes and transports proteins and lipids.
golgi apparatus|Packs, labels and ships proteins and lipids out of the cell.
ribosomes|Tiny factories that build proteins from instructions.
lysosomes/lysosome|Digestive bags: break down waste, germs and worn-out parts.
cell membrane/plasma membrane|Selective skin: lets needed materials in, keeps harmful ones out.
cytoplasm|Jelly-like fluid where most cell reactions happen and organelles float.
cell wall|Rigid outer coat of plants/bacteria: gives shape and protection.
chloroplast|Contains chlorophyll: traps sunlight to make glucose (photosynthesis).
central vacuole/large central vacuole|Stores water, food and waste; keeps plant cell firm (turgid).
vacuole|Storage sac for water, nutrients and waste.
nuclear envelope|Double membrane around the nucleus, guarding the DNA.
nucleolus|Dense spot inside nucleus that makes ribosomes.
chromatin|Loose DNA + protein threads that coil into chromosomes.
nuclear pore|Gate in the nuclear envelope for RNA and proteins to pass.
nucleoplasm|Fluid inside the nucleus that holds chromatin and nucleolus.
outer membrane|Smooth outer boundary; lets small molecules in.
inner membrane/inner membrane cristae|Folded membrane where most ATP is produced.
matrix|Inner fluid of mitochondria with enzymes for respiration.
cristae folds|Folds that increase surface area for ATP making.
phospholipid bilayer|Double fat layer forming the basic structure of the membrane.
protein channel|Gateway protein that lets specific substances cross the membrane.
cholesterol|Keeps the membrane flexible yet stable.
carbohydrate chain|Surface sugar tag for cell recognition and signalling.
squamous cells|Flat cells: thin lining for easy diffusion (alveoli, skin surface).
cuboidal cells|Cube-shaped cells for secretion and absorption (glands, kidney tubules).
columnar cells|Tall cells for absorption and mucus secretion (intestine lining).
basement membrane|Thin base layer anchoring epithelial cells to tissue below.
skeletal muscle|Voluntary striped muscle: moves bones.
smooth muscle|Involuntary muscle in gut, vessels: slow, steady contraction.
cardiac muscle|Involuntary muscle of the heart: pumps without tiring.
collagen fibers|Strong protein fibres that give tissue strength.
fibroblasts|Cells that make collagen and repair connective tissue.
adipocytes/adipocytes fat|Fat cells: store energy and insulate the body.
cartilage|Smooth, flexible tissue: cushions joints and shapes nose/ear.
bone|Hard tissue: supports body, protects organs, stores calcium.
cell body soma|Main part of neuron: nucleus and life-support machinery.
dendrites|Branch-like ends that receive signals from other neurons.
axon|Long fibre that carries the signal away from the cell body.
myelin sheath|Fatty insulation that speeds up nerve impulses.
synapse|Gap where one neuron passes the signal to the next using chemicals.
teeth|Cut, tear and grind food (mechanical digestion).
tongue|Mixes food with saliva, tastes it and pushes it to swallow.
salivary glands/salivary gland|Make saliva; amylase starts digesting starch.
hard palate|Roof of the mouth: firm surface to press food against.
oral mucosa|Moist lining that protects the mouth and keeps it lubricated.
tonsil|Lymph tissue guarding against germs entering by the throat.
pharynx|Throat: common passage for food and air; swallowing begins here.
oesophagus/esophagus|Muscular tube that pushes food to stomach by peristalsis.
stomach|Churns food with acid and pepsin to digest protein.
gastric juice hcl pepsin mucus|HCl kills germs, pepsin digests protein, mucus protects stomach wall.
exit of stomach duodenum|Pyloric valve releases food slowly into the small intestine.
fundus|Upper dome of stomach: stores gas and food.
body|Main part of stomach where churning and digestion occur.
pylorus|Lower end with a valve that controls food into the duodenum.
rugae folds|Folds that let the stomach stretch and grip food.
duodenum|First part of small intestine: bile and pancreatic juice mix in.
small intestine|Final digestion and absorption of nutrients into blood.
villi/villus|Finger-like projections that increase absorption area.
blood capillaries|Tiny vessels in villi that carry absorbed glucose and amino acids.
lacteal lymph vessel|Absorbs digested fats into the lymph.
magnified not to scale procedural|Enlarged view of the intestinal wall to show absorption.
large intestine/ascending colon|Absorbs water and salts from undigested food.
transverse colon|Carries waste across the abdomen while water is absorbed.
descending colon|Stores and moves compacted waste downward.
appendix|Small pouch off the large intestine; little role in humans.
rectum/rectum schematic|Stores faeces until egestion.
anus anal sphincter/anus|Exit opening; sphincter controls egestion of faeces.
liver|Makes bile, stores glycogen, detoxifies blood.
right lobe|Larger part of liver, doing most metabolic work.
left lobe|Smaller liver lobe sharing bile and metabolic functions.
gall bladder/gallbladder|Stores and releases bile to emulsify fats.
pancreas|Makes digestive enzymes and insulin/glucagon hormones.
bile duct/bile duct schematic|Carries bile from liver/gall bladder to duodenum.
petal|Colourful part that attracts pollinators.
sepal|Green leaf-like part protecting the flower bud.
stamen anther/stamen|Male part: anther makes pollen grains.
pistil stigma/pistil|Female part: stigma catches pollen, ovary holds ovules.
ovary|Female organ: forms ovules/eggs; becomes the fruit (plants) or releases eggs and hormones (animals).
ovule|Contains the egg; becomes the seed after fertilisation.
seed coat|Hard outer cover protecting the embryo.
embryo|Baby plant inside the seed.
radicle|Embryonic root: grows first, anchors seedling.
plumule|Embryonic shoot: grows into stem and leaves.
cotyledon|Stores food for the growing embryo (seed leaf).
seedling|Young plant after germination, starting photosynthesis.
seed|Carries the embryo and food store to grow a new plant.
trachea/windpipe|Cartilage-ringed air tube from throat to lungs.
bronchus|Branch of trachea leading air into each lung.
left lung|Gas exchange organ; smaller to make room for the heart.
right lung|Gas exchange organ with three lobes.
lungs|Exchange O₂ into blood and remove CO₂.
diaphragm|Dome-shaped muscle that drives breathing in and out.
alveoli|Tiny air sacs where O₂ and CO₂ diffuse across thin walls.
skull|Protects brain, eyes and ears.
rib cage/rib cage breastbone|Bony cage protecting heart and lungs; moves in breathing.
humerus|Upper-arm bone; attaches shoulder to elbow.
elbow joint|Hinge joint: bends and straightens the arm.
pelvis|Supports body weight and protects pelvic organs.
knee joint|Hinge joint: bends the leg and bears weight.
femur|Thigh bone: longest, strongest bone.
epidermis|Outer skin layer: waterproof barrier with pigment.
dermis|Middle layer with nerves, vessels, glands and hair roots.
hypodermis fat|Fat layer that insulates and cushions.
hair follicle|Root pit from which hair grows.
sweat gland|Releases sweat to cool the body and remove salts.
blood vessel|Tube that carries blood around the body.
incisor|Chisel-shaped tooth for cutting.
canine|Pointed tooth for tearing.
premolar|Flat tooth for crushing and grinding.
molar|Broad back tooth for heavy grinding.
enamel|Hardest tissue; protects the tooth surface.
gum|Soft tissue holding teeth firmly.
monera bacteria|Simple single-cell organisms without a nucleus.
protista amoeba|Single-celled organisms with a nucleus; move and feed by pseudopodia.
fungi mushrooms|Absorb food from dead matter; not photosynthetic.
plantae fern|Make their own food by photosynthesis.
animalia butterfly frog|Multicellular organisms that eat other organisms.
domain bacteria|True bacteria: prokaryotic, no nucleus, most are free-living.
domain archaea|Prokaryotes living in extreme places (hot springs, salt lakes).
domain eukarya protista fungi plantae animalia|All organisms with a true nucleus.
viral capsid head|Protein head that stores the virus's genetic material.
helical tail sheath|Contracts to inject viral DNA into the host.
tail fibres|Legs that grip the bacterial surface.
protein coat capsid|Protective shell around viral genes.
genetic material dna rna|The instructions the virus uses to hijack host cells.
spikes attach to host|Lock onto host cell receptors to enter.
virus|Non-cellular germ that multiplies only inside living cells.
bacterium/rod bacterium prokaryote|Single-celled prokaryote; many are useful, some cause disease.
bacterial flagella/flagellum|Whip-like tail for swimming.
nucleoid no nuclear membrane|Region holding bacterial DNA without a membrane.
plasmid/bacterial circular plasmid dna|Small circular DNA ring; vehicle for genetic engineering.
human cell|Typical animal cell with a nucleus: the target of viruses.
fungal hyphae give water shelter|Fungus threads supply water/minerals and shelter in lichen.
algal cells make food|Algae photosynthesise and feed the fungus in lichen.
leaf mesophyll chloroplasts|Leaf tissue packed with chloroplasts for photosynthesis.
mitochondria cellular respiration|Release energy from glucose for the cell.
stomata guard cells|Tiny pores regulating gas exchange and water loss.
o₂ intake co₂ release|Gas exchange in respiration.
root hair oxygen absorption|Root hairs take in O₂ and water from the soil.
mushroom cap gills|Gills produce and release spores.
released fungal spores|Tiny reproductive units spread by air.
hyphae mycelium network|Thread network absorbing nutrients from the substrate.
budding yeast cells|Yeast reproducing by growing buds.
mold sporangium|Sac that makes spores in bread mould.
carbohydrates roti bread rice|Main energy source for the body.
proteins eggs pulses paneer|Build and repair body tissues.
vitamins minerals veg fruits|Protect health and regulate body processes.
healthy fats oil butter nuts|Concentrated energy; insulate and protect organs.
clean drinking water|Needed for digestion, transport and temperature control.
base illuminator mirror|Directs light up through the specimen.
iris diaphragm condenser|Controls and focuses the amount of light.
mechanical stage slide|Holds slide and moves it smoothly.
nosepiece objective lens|Revolving lenses give different magnifications.
ocular eyepiece lens|Lens you look through; magnifies image further.
coarse fine focus knobs|Bring image into sharp focus (coarse first, then fine).
low resolution blurred light wave|Long light waves cannot resolve tiny details.
high resolution short electron beam|Short wavelength reveals very fine details.
compound light microscope|Magnifies cells with visible light and lenses.
electron microscope column tem sem|Uses electron beams to see viruses and organelles.
nanoscale virus display|Shows viruses visible only under electron microscope.
outer cooling water jacket|Water jacket removes heat and holds fixed temperature.
motor impeller nutrient broth|Impeller stirs broth for even mixing of nutrients.
stirrer impeller|Mixes broth to spread nutrients and oxygen.
ring air sparger o₂ bubbles|Releases air bubbles to supply oxygen.
sparger air inlet|Bubbles sterile air into the culture.
cooling jacket|Removes heat to keep the culture at best temperature.
ph sensor probe|Monitors acidity so conditions stay ideal.
feed ports ph temp sensor|Add nutrients and monitor pH and temperature.
nutrient inoculum inlet|Entry for food and starter microbes.
exhaust outlet|Releases waste gases.
product outlet|Collects the finished product.
growth curve lag log stationary decline|Population growth in four phases: adapt, boom, plateau, die-off.
growth curve|Shows how microbe numbers change over time.
fermenter|Large tank growing microbes under controlled conditions.
human insulin gene restriction cut|Gene for insulin is cut out by restriction enzymes.
human insulin gene|DNA instruction to make human insulin.
restriction enzyme|Molecular scissors that cut DNA at specific sites.
dna ligase & recombinant plasmid/dna ligase recombinant plasmid|Glue enzyme that joins the gene into the plasmid.
dna ligase|Molecular glue that joins DNA pieces.
recombinant plasmid|Plasmid carrying the new human gene.
transformed e coli in fermenter|Bacteria carrying the gene make insulin as they grow.
e coli bacterium|Fast-growing host that copies the gene and makes insulin.
purified recombinant insulin|Final pure insulin for diabetic patients.
insulin product|Purified human insulin ready for use.
solid tightly packed|Fixed shape and volume; particles tightly packed.
particles vibrate in place|Particles only vibrate about fixed positions.
liquid close but moving|Fixed volume, no fixed shape; particles slide past.
particles flow|Particles slide so liquid can flow.
gas spread far apart|No fixed shape or volume; particles far apart.
particles move fast|Fast random motion makes gases expand and fill containers.
beaker|Glass container to hold and mix liquids.
water|Common solvent; dissolves many substances.
copper sulfate crystals|Blue crystals that dissolve and spread: shows diffusion.
blue colour spreading|Shows particles diffusing from high to low concentration.
diffusing particles|Move from crowded to less crowded regions.
evaporating dish|Dish to evaporate solvent and crystallise solute.
water vapour|Gaseous water leaving by evaporation.
bunsen burner flame/bunsen burner|Gives controlled heat for experiments.
wire gauze|Spreads heat evenly under glassware.
filter paper|Traps solid particles but lets liquid pass.
funnel|Guides liquid into a narrow-necked container; holds filter paper.
conical flask|Holds liquids; narrow neck reduces spills.
residue/residue on filter paper|Solid left behind on the filter paper.
filtrate|Clear liquid that passes through the filter.
iron stand|Supports apparatus at the right height.
water molecule h₂o/water molecule|Two hydrogen + one oxygen atom bonded together.
oxygen molecule o₂/oxygen molecule|Two oxygen atoms bonded; needed for respiration and burning.
oxygen|Gas that supports burning and breathing.
carbon dioxide co₂|Product of respiration and burning; used in photosynthesis.
atom|Smallest unit of an element that keeps its properties.
chemical bond|Force that holds atoms together.
proton/proton +|Positive particle in the nucleus; defines the element.
neutron/neutron 0|Neutral particle in the nucleus; adds mass.
electron/electron −|Negative particle orbiting the nucleus; forms bonds.
shell orbit|Energy level where electrons move around the nucleus.
light beam/torch|Used to detect particles by scattering light.
colloid|Mixture with medium-sized particles that scatter light but don't settle.
scattered light|Tyndall effect: path of light becomes visible in a colloid.
light path|Visible beam shows colloid particles scattering light.
particles|Tiny pieces of matter making up the substance.
solution homogeneous/solution|Uniform mixture; particles tiny, no scattering, no settling.
suspension heterogeneous|Large particles that settle on standing and scatter light.
undissolved solute|Solute that has not dissolved; settles at the bottom.
solubility curve|Graph showing how much solute dissolves at different temperatures.
nucleus protons neutrons|Dense centre carrying nearly all the mass and positive charge.
k shell n 1 max 2/shell k n 1|Innermost shell: holds up to 2 electrons.
l shell n 2 max 8/shell l n 2|Second shell: holds up to 8 electrons.
m shell n 3|Third shell: holds up to 18 (8 for first 20 elements).
indivisible sphere|Dalton: atom is a solid, indivisible ball.
positive sphere|Thomson: positive charge spread through the atom.
embedded electrons|Thomson: electrons sit in the positive sphere like plum pudding.
gold foil|Very thin foil that alpha particles were fired at.
α particle beam|Stream of positive particles used as a probe.
electron spirals in|Rutherford model problem: orbiting electron would lose energy and collapse.
photon energy emitted|Light released when an electron jumps down a shell.
balance reading|Shows the mass stays the same before and after reaction.
sealed flask|Closed flask so no matter escapes: tests conservation of mass.
test tube bacl₂|Contains barium chloride solution for the reaction.
white precipitate baso₄/white precipitate|Insoluble solid formed in a double displacement reaction.
same mass of 100 g sample|Same compound always has the same mass ratio of elements.
shared electron pair bond|Electrons shared between atoms form a covalent bond.
shared electron pair|Pair of electrons shared by two atoms.
cation + and anion − held by attraction|Opposite charges attract to form an ionic bond.
cathode −/cathode electron emitter|Negative electrode that releases electrons.
anode +|Positive electrode that attracts electrons.
+ plate|Positive plate: attracts negative particles.
− plate|Negative plate: repels electrons / attracts positive particles.
screen/fluorescent zinc sulphide screen|Glows where the particles land.
perforated cathode/perforated cathode disc|Lets positive rays pass through holes.
positive ions/positive canal rays protons|Positive particles that travel opposite to electrons.
α source|Radioactive source emitting alpha particles.
beryllium|Target that emits neutral radiation when hit by alpha particles.
neutral radiation|Uncharged particles (neutrons) discovered by Chadwick.
paraffin protons knocked out|Neutrons knock protons out of paraffin, proving they have mass.
lamp/hydrogen discharge lamp|Source of light from excited hydrogen.
prism/triangular glass prism|Splits light into separate wavelengths.
energy level diagram|Shows energy shells and electron jumps.
spectrum screen/discrete spectral lines|Shows a line spectrum showing fixed energy jumps.
quantized bohr energy shells|Electrons can exist only in fixed energy levels.
electron jumps lyman balmer|Jumps to n = 1 (UV) or n = 2 (visible) emit light.
rutherford positive nucleus|Tiny dense centre holding all the positive charge.
alpha particle scattering|Most pass through, a few deflect: atom is mostly empty space.
elliptical orbits unstable|Classical orbits would spiral in, so atom would collapse.
bohr stationary orbits n 1 2 3 4|Stable orbits where electrons don't lose energy.
emitted photon on orbit jump|Energy difference released as light.
non bonding lone electron pairs|Electrons not shared in bonds.
expanded octet geometry sf₆|Central atom holds more than 8 electrons.
valence electrons dots|Outer electrons involved in bonding.
atom core nucleus inner shells|Nucleus plus inner electrons.
positive metal cation lattice|Fixed positive ions in a metal.
positive metal ions fixed lattice|Fixed ions form the metal frame.
sea of mobile delocalized electrons/mobile electron sea|Free electrons carry current and heat, and hold ions together.
battery electric field|Drives the electrons in one direction.
central atom|Atom in the middle that bonds with others.
mobile phase solvent eluent|Solvent that carries the mixture along.
eluent mobile phase|Solvent that carries the mixture through the column.
stationary phase silica gel/silica gel alumina stationary phase|Fixed material that holds components back by different amounts.
separated pigment bands|Components separated by different speeds.
sample mixture bands|Mixed components start to separate in bands.
glass stopcock valve|Controls the outflow of liquid.
collected separated fraction/collected fractions|Separated components collected one by one.
heated boiling flask/distillation flask mixture|Mixture is heated so the lowest boiling liquid vaporises first.
bead packed fractionating column/fractionating column|Gives surfaces for repeated condensation and evaporation, so close boiling points separate.
liebig water condenser/condenser|Cools vapour back into liquid.
distillate receiving flask/receivers fractions|Collects the condensed liquid.
crude oil multi tray tower/crude oil fractionating tower|Separates crude oil into fractions by boiling point.
crude oil heated vapour enters|Hot crude vapour enters at the bottom of the tower.
dynamics cart|Low-friction cart used to study motion and force.
track rail|Smooth path for motion experiments.
meter ruler|Measures length in metres/centimetres.
ticker timer|Marks dots at equal times to analyse motion.
motion blur|Shows the object is moving fast.
release hand|Starts the motion from rest.
cart 1/cart a|First cart in the collision.
cart 2/cart b|Second cart in the collision.
cart|Wheeled body used to study motion.
force arrow/force f|Arrow showing the direction and size of a force.
inertia at rest|Object resists any change in its state of rest.
collision point|Place where the carts interact and momentum is exchanged.
apple|Falls under gravity: Newton's inspiration.
fall direction|Gravity pulls toward the Earth's centre.
earth|Source of gravity pulling objects toward its centre.
gravitational field|Region where mass experiences gravitational force.
mass|Amount of matter; measures inertia.
pendulum bob|Swinging mass used to study energy conversion.
bob|Swinging mass at the end of the string.
highest point|Maximum potential energy, zero kinetic energy.
lowest point|Maximum kinetic energy, minimum potential energy.
potential energy|Energy stored due to position.
kinetic energy|Energy due to motion.
string|Holds the bob and gives the tension force.
tuning fork|Vibrates at a fixed frequency to produce pure sound.
vibration|Back-and-forth motion that produces sound.
sound waves|Longitudinal waves carrying sound through a medium.
compression/compression dense|Region where particles are squeezed together (high pressure).
rarefaction/rarefaction spread out|Region where particles are spread apart (low pressure).
vibrating source speaker|Creates sound by vibration.
wavelength λ|Distance between two successive compressions.
displacement vs distance|Wave graph at one instant.
displacement vs time one point|Wave graph for one particle over time.
revolving mass|Body moving in a circle.
centripetal force inward|Force toward the centre keeping the body in circle.
tangential velocity|Velocity along the tangent; the body flies off straight if string breaks.
circular orbit path|Circular path followed by the body.
central pivot|Fixed centre of rotation.
lever beam|Rigid bar that turns about the fulcrum.
triangular fulcrum/fulcrum|Pivot point of the lever.
pulley hanging load/pulley|Changes direction of force to lift loads easily.
inclined plane ramp/inclined plane|Slope that reduces effort needed to raise a load.
wheeled cart|Cart that rolls with little friction.
load l/load|Weight to be moved.
effort e/effort rope|Force applied to move the load.
atmosphere air layer/atmosphere|Layer of gases: air, weather and protection.
cryosphere polar ice|Frozen water: ice caps, glaciers.
hydrosphere oceans|All water on Earth: oceans, rivers, lakes.
biosphere forests life|All living things on Earth.
geosphere crust mantle|Solid Earth: rocks, crust and mantle.
cool ocean water/sea cooler by day|Cooler water creates high pressure by day.
onshore sea breeze/surface wind|Cool wind from sea to land.
warm sunlit land/land warmer by day|Land heats quickly and warms the air above.
rising warm air/warm air rises|Hot air rises, creating low pressure.
upper return convection|Air flows back to sea at height, completing the cell.
sun|Source of light and heat energy.
parallel sunlight|Sun's rays reach Earth almost parallel.
surface patch|Area receiving sunlight in the model.
equator|Imaginary line at 0° latitude, receives most direct sunlight.
mountain slope|Surface that heats and sends air up the slope.
car object|Moving body used to study motion.
position–time|Graph: slope gives velocity.
velocity–time area displacement|Graph: slope gives acceleration, area gives displacement.
acceleration–time|Graph showing how acceleration varies.
velocity v tangent|Velocity direction is tangent to the path.
acceleration to centre|Acceleration towards the centre in circular motion.
centre|Middle point of the circular path.
block|Body on which forces act.
trolley m|Cart pulled by the hanging mass.
hanging mass m|Provides pulling force (weight = mg).
f–a graph straight line through origin|Shows F ∝ a: slope is mass.
ball m 1 kg|Test mass in the experiment.
ke|Kinetic energy.
pe|Potential energy.
total|Total mechanical energy remains constant.
meter ruler length m|Measures length in metres.
vernier caliper precision|Measures lengths to 0.1 mm.
beam balance standard masses kg|Compares and measures mass in kg.
stopwatch clock time s|Measures time in seconds.
graduated cylinder thermometer|Measures volume (cylinder) and temperature (thermometer).
stationary ground observer|Sees the moving train frame as moving.
moving train frame|Frame moving relative to the ground.
horizontal component vector|Part of a vector along the x-axis.
vertical component vector|Part of a vector along the y-axis.
resultant displacement vector|Net shift from start to end.
forward frame acceleration a|Frame accelerates forward.
backward pseudo force f ma|Apparent force felt backward in an accelerating frame.
passenger tilted backward|Passenger leans back due to inertia.
upward lift acceleration|Lift accelerating up makes you feel heavier.
compressed scale apparent weight|Scale reads more than real weight.
spring balance reading|Reading shows apparent weight.
unstretched equilibrium spring|Spring at natural length.
single load extension x|One load stretches the spring by x.
double load extension 2x|Twice the load stretches twice as much.
hooke s law line f kx|Force is directly proportional to extension.
elastic potential energy ½kx²|Energy stored in a stretched/compressed spring.
direct equatorial solar heating|Sun's rays fall directly at equator, more heat.
tilted earth axis 23 5°|Tilt causes seasons.
slanted polar grazing rays|Slanting rays spread over larger area, less heat.
low albedo ocean forest|Dark surfaces absorb more sunlight.
high albedo snow ice|Bright surfaces reflect sunlight back.
evaporation from ocean|Sun turns sea water into vapour.
condensation precipitation|Vapour cools into clouds and falls as rain/snow.
groundwater aquifer runoff|Water flows over land and seeps underground.
carbon oxygen cycle plants animals|Plants take CO₂ and release O₂; animals do the reverse.
nitrogen fixing soil microbes|Convert atmospheric nitrogen into usable nitrates.
interphase|DNA copies itself and cell grows before dividing.
prophase|Chromosomes condense; nuclear envelope breaks down.
metaphase|Chromosomes line up at the equator.
anaphase|Sister chromatids pulled to opposite poles.
telophase|Two new nuclei form around the separated chromosomes.
cytokinesis|Cytoplasm divides to form two daughter cells.
mitotic spindle|Fibres that pull the chromosomes apart.
sister chromatids|Two identical copies of one chromosome.
chromosome two chromatids|Condensed DNA with two identical halves.
sister chromatids move apart|Pulled to opposite poles in anaphase.
two identical daughter cells|Mitosis gives genetically identical cells.
homologous pair crossing over|Chromosome pair swapping segments, increasing variation.
n 2 cells|Two cells after meiosis I (each haploid).
4 haploid cells|Meiosis ends with four cells with half the chromosomes.
centromere|Joint holding two sister chromatids together.
telomere|Protective cap at chromosome ends.
histone nucleosomes|Proteins that spool DNA into compact beads.
dna double helix|Twisted ladder structure that stores genetic code.
base pairs|A–T and G–C pairs form the rungs.
sugar phosphate backbone|Side rails that hold the DNA ladder together.
gene segments|Stretches of DNA that code for traits.
punnett square|Grid for predicting the offspring genotypes.
root hairs|Increase surface area for water absorption.
soil water|Source of water and dissolved minerals.
mineral ions|Nutrients absorbed by roots.
cortex cells|Pass water across the root to the xylem.
xylem vessels/xylem vein|Tubes carrying water and minerals upward.
stomata open|Open pores release water vapour and exchange gases.
guard cells|Open and close the stomata.
water vapor|Gaseous water lost through transpiration.
sunlight|Energy source for photosynthesis.
co₂ in|Carbon dioxide enters leaf through stomata.
o₂ out|Oxygen released by photosynthesis.
water in|Absorbed from soil through roots.
glucose|Food made in photosynthesis; used for energy.
auxin|Growth hormone that makes cells elongate.
phototropism|Growth of plant toward light.
gravitropism|Roots grow down, shoots grow up in response to gravity.
shoot tip|Growing tip that makes auxin and senses light.
heart/heart about the size of a fist|Muscular pump that circulates blood.
aorta|Largest artery: carries oxygen-rich blood from the heart to the body.
pulmonary artery|Carries oxygen-poor blood from heart to lungs.
pulmonary vein|Carries oxygen-rich blood from lungs to the heart.
vena cava|Large veins returning blood to the heart.
superior vena cava|Brings blood back from the upper body.
inferior vena cava|Brings blood back from the lower body.
right atrium|Receives oxygen-poor blood from the body.
right ventricle|Pumps oxygen-poor blood to the lungs.
left atrium|Receives oxygen-rich blood from the lungs.
left ventricle thickest wall|Strongest chamber: pumps blood to the whole body.
valves schematic action|One-way flaps preventing blood from flowing back.
oxygen in carbon dioxide out conceptual|Gas exchange in lungs.
to the lower body|Blood heading to legs and organs.
coronary arteries feed the heart muscle|Supply the heart muscle itself with blood.
blood passes twice through the heart|Double circulation: lungs loop and body loop.
oxygenated blood|Blood rich in O₂ (bright red).
deoxygenated blood|Blood poor in O₂ (dark red).
kidneys|Filter blood, remove urea and balance water.
nephron|Functional filtering unit of the kidney.
glomerulus|Cluster of capillaries that filters blood.
bowman capsule|Cup that collects the filtrate.
ureters|Tubes carrying urine to the bladder.
urinary bladder|Stores urine until it is passed out.
brain|Control centre for thinking, memory and coordination.
spinal cord|Relay for signals between brain and body; reflexes.
neuron|Nerve cell that carries electrical messages.
pituitary gland|Master gland controlling other hormone glands.
thyroid gland|Makes thyroxine, which controls metabolism.
adrenal glands|Release adrenaline for fight-or-flight.
ovaries testes|Make sex cells and sex hormones.
hormones|Chemical messengers carried in blood.
testes|Make sperm and testosterone.
scrotum|Keeps testes slightly cooler than body for sperm.
uterus|Womb where the embryo grows.
ovaries|Release eggs and make oestrogen.
sperm|Male gamete that swims to fertilise the egg.
egg ovum|Female gamete containing food store.
birth rate|Number of births per population in a time.
death rate|Number of deaths per population in a time.
food resources|Food available for the growing population.
water resources|Fresh water available for use.
population growth|Rise in numbers when births exceed deaths.
australopithecus|Early ape-human who walked upright.
homo habilis|Early tool-maker.
homo erectus|Upright walker who used fire.
homo sapiens/modern human|Present-day humans with large brain and language.
factory smoke|Releases gases and particles that pollute air.
car exhaust|Emits CO and NOx.
dead tree|Shows damage from pollution/acid rain.
trash|Solid waste polluting the land.
air land pollution|Harmful substances in air and soil.
dividing nucleus 1/dividing nucleus 2|Nucleus splits during binary/multiple fission.
cytoplasmic constriction|Cell pinches in two.
contractile vacuole|Pumps out excess water.
pseudopodia|False feet for movement and engulfing food.
parent hydra body|Parent animal producing a bud.
parent tentacles|Catch food for the parent.
growing daughter bud|New hydra growing on parent.
bud tentacles|Tentacles developing on the bud.
basal disc|Base that sticks to a surface.
potato tuber|Underground stem storing starch.
sprouting shoot from eye|New plant from a bud on the tuber.
adventitious roots|Roots growing from non-root parts.
bryophyllum leaf|Leaf that grows new plantlets.
leaf margin plantlets|Tiny new plants grow at leaf edges.
producers plants level 1|Make food by photosynthesis; base of the food chain.
primary consumers deer grasshoppers|Herbivores that eat plants.
secondary consumers snakes frogs|Carnivores that eat herbivores.
apex predator tiger level 4|Top predator without natural enemies.
producers grass berries|Plants forming the food base.
primary consumers rabbit insects|Plant-eaters.
frog secondary consumer|Eats insects.
snake tertiary consumer|Eats frogs and small animals.
apex predators eagle fox|Top-level carnivores in the web.
magnesium ribbon|Metal that burns brightly in oxygen.
bright white flame|Shows rapid exothermic combustion.
magnesium oxide ash|White product MgO of burning.
crucible|Heat-resistant cup for strong heating.
ferrous sulphate crystals|Green crystals that decompose on heating.
test tube|Small glass tube for reactions.
brown ferric oxide|Brown solid left after FeSO₄ decomposes.
heat flame|Supplies energy for the reaction.
tongs|Holds hot objects safely.
zinc strip|More reactive metal that displaces copper.
copper sulphate solution|Blue solution of Cu²⁺ ions.
copper deposit|Reddish copper formed in displacement.
blue colour fading|Cu²⁺ ions are being used up.
sodium sulphate|Soluble product in the double displacement.
barium chloride|Reactant that gives BaSO₄ precipitate.
sodium chloride nacl|Table salt; ionic compound.
red acidic|Low pH, strong acid.
yellow weakly acidic|Weak acid pH 4–6.
green neutral|pH 7, neutral.
blue basic|pH 8–10, basic.
violet strongly basic|pH 11–14, strong base.
ph strip|Paper changing colour with pH.
burette|Precisely delivers a measured volume of liquid.
pink basic solution|Phenolphthalein is pink in base.
phenolphthalein|Indicator: colourless in acid, pink in base.
zinc granules|Metal reacting with acid to give hydrogen.
dilute hydrochloric acid|Acid that reacts with the metal.
hydrogen gas bubbles|Shows hydrogen is released.
effervescence|Fizzing of gas bubbles.
magnesium most reactive|Most reactive in the series.
zinc|Moderately reactive metal.
iron|Moderately reactive metal.
copper least reactive|Least reactive here, doesn't react with dilute acid.
dilute acid|Reacts with metals to release hydrogen.
methane ch₄|Simplest hydrocarbon; forms four covalent bonds.
water h₂o|Product of the reaction.
oxygen o₂|Reactant that supports combustion.
covalent bond|Bond formed by sharing electrons.
micelle|Soap ball: tails trap grease, heads face water.
hydrophilic head|Water-loving head that dissolves in water.
hydrophobic tail|Water-hating tail that sticks into grease.
grease droplet|Oil/dirt trapped inside the micelle.
reactants 2h₂ o₂|Starting substances.
products 2h₂o|Substances formed.
mass balance scale|Shows mass conservation.
oxygen molecule o₂|Gas needed for oxidation.
water molecule h₂o|Water formed.
copper ii oxide cuo|Black oxide that is reduced.
reduced copper cu|Brown copper after loss of oxygen.
bunsen burner|Source of heat.
hydrogen gas h₂|Reducing agent that removes oxygen.
condensed water h₂o|Water vapour condensed.
iron rust fe₂o₃ xh₂o|Brown flaky coating from corrosion.
copper carbonate patina|Green layer on copper.
silver sulphide ag₂s|Black tarnish on silver.
red litmus acid|Stays red in acid.
blue litmus base|Turns red in acid, stays blue in base.
turmeric red brown in base|Turns red-brown in base.
phenolphthalein acid|Colourless in acid.
phenolphthalein base|Pink in base.
baking soda nahco₃|Mild base: antacid, baking.
copper sulphate cuso₄ 5h₂o|Blue vitriol with water of crystallisation.
washing soda na₂co₃ 10h₂o|Base that removes hardness of water.
plaster of paris|Sets hard when mixed with water.
electrical conductivity|Metals conduct electricity.
malleable aluminium foil|Can be beaten into thin sheets.
ductile copper wire|Can be drawn into wires.
sulphur non metal|Brittle, non-conductor.
brittle carbon|Breaks easily; poor conductor.
sodium atom na 2 8 1|One outer electron to lose.
electron transfer|Electron moves from metal to non-metal.
chlorine atom cl 2 8 7|Needs one electron.
chloride ion cl⁻|Negative ion.
sodium ion na⁺|Positive ion.
roasting furnace|Heats sulphide ores in air.
molten metal|Liquid metal from smelting.
impure anode +|Dissolves during electro-refining.
pure cathode −|Pure metal deposited.
anode mud|Impurities settle.
galvanisation zinc|Zinc coating prevents iron from rusting.
painting|Blocks air and water.
oiling greasing|Moving parts protected.
alloying steel|Mixing metals to resist corrosion.
diamond tetrahedral|Hard, each C bonded to four.
graphite layers|Slippery, conducts electricity.
fullerene c₆₀|Soccer-ball-shaped molecule.
methane ch₄|First alkane (1 C).
ethane c₂h₆|Alkane with two carbons.
propane c₃h₈|Alkane with three carbons used as LPG.
butane c₄h₁₀|Alkane with four carbons.
carbon backbone c|Chain of carbon atoms.
ethanol ethanoic acid|Reactants of esterification.
warm water bath|Gentle, safe heating.
conc h₂so₄ dropper|Catalyst and dehydrating agent.
spirit lamp flame|Gentle heat source.
retort clamp stand|Holds the apparatus steady.
incident ray|Ray that strikes the surface.
plane mirror|Flat mirror: forms virtual image of the same size.
reflected ray|Ray that bounces off the mirror.
normal|Perpendicular reference line.
angle of incidence|Angle between incident ray and normal.
angle of reflection|Equal to angle of incidence.
glass slab|Rectangular glass that shifts the ray sideways.
refracted ray|Bent ray inside medium.
emergent ray|Ray leaving the slab parallel to the incident ray.
parallel rays|Rays travelling parallel to each other.
convex lens|Converges rays to a focus.
focal point|Point where parallel rays meet.
principal axis|Line through the optical centre.
battery|Source of electric energy.
ammeter|Measures current in series.
voltmeter|Measures potential difference in parallel.
resistor|Opposes current.
switch|Opens and closes the circuit.
bulb|Converts electrical energy to light.
wire|Conducts current.
parallel branch|Alternative path for current.
iron nail|Soft iron core becomes an electromagnet.
copper coil|Carries the current making a magnetic field.
paper clips|Show magnetic strength by being attracted.
coil|Carries current and produces a magnetic field.
magnet|Provides the magnetic field.
commutator|Reverses current every half turn.
brushes|Contacts conducting current to the coil.
white light|Mixture of all colours.
spectrum|Band of colours.
vibgyor colors|Violet to red order.
cornea|Transparent front; most refraction.
iris pupil|Iris controls size of pupil.
crystalline lens|Fine-focus lens.
ciliary muscles|Change the lens shape.
vitreous humour|Clear gel maintaining eye shape.
retina|Light-sensitive layer forming the image.
optic nerve|Sends signals to the brain.
white light source|Provides a mix of colours.
colloidal glass tank|Tank of scattering colloid.
scattered blue beam|Blue scatters most.
red orange transmitted spot|Red passes straight, as in sunset.
projection screen|Shows the image.
glowing nichrome coil|Heating element glows by Joule heating.
water calorimeter beaker|Holds water to measure heat.
thermometer|Measures temperature rise.
rheostat|Variable resistor.
switch key|Closes or opens the circuit.
dc battery pack|Supply of DC voltage.
magnetic pole left|One pole of the magnet.
magnetic pole right|Other pole of the magnet.
iron filings field loops|Show field lines.
compass needle top/compass needle right|Points along the field direction.
moving bar magnet|Changing flux induces current.
copper solenoid coil|Coil in which emf is induced.
deflected galvanometer|Needle shows induced current.
connecting leads|Connect the circuit parts.
earth copper electrode|Sends leakage current to ground.
electricity meter|Measures energy in kWh.
main fuse mcb box|Cuts supply on overload.
live wire red|Carries the current at high potential.
neutral wire black|Return path.
earth wire green|Safety path to ground.
parallel lamp holders|Each lamp works independently.
3 pin wall socket|Live, neutral and earth connections.
left chamber/right chamber|Side of the osmosis U-tube; water moves toward the more concentrated side.
semi permeable membrane|Lets water pass but blocks solute particles.
solute particle|Dissolved particle too big to cross the membrane.
biceps contracts|Contracts to bend (flex) the arm.
triceps|Contracts to straighten (extend) the arm; works opposite biceps.
tendon|Tough cord joining muscle to bone.
ball|Rounded end that rotates freely in a socket joint.
socket|Cup that holds the ball: allows rotation in all directions.
pivot|Rotation about a single axis (e.g. neck turning).
suture fixed|Immovable joint locking skull bones.
parent plant fruits|Source of fruits and seeds for dispersal.
pond|Water body where seeds/spores are carried by water.
animal biotic agent|Animals carry seeds on fur or in dung.
bursting pod|Pod splits open and throws seeds away (explosive dispersal).
hydrosphere|All water on Earth: oceans, rivers, lakes.
geosphere|Solid Earth: crust, mantle and core.
biosphere|All living things and where they live.
ball inertia|Stays at rest or in motion until a force acts.
listener source|Where sound is produced or received.
reflecting wall|Bounces sound back, creating an echo.
bat emits ultrasound|Sends high-frequency sound to find prey.
moth reflects|Reflects the sound back to the bat (echolocation).
gol gumbaz bijapur whispering gallery repeated reflections|Dome reflects sound again and again so whispers carry far.
vibrating string|Vibration produces sound (guitar, sitar).
vibrating membrane|Stretched skin vibrates to make sound (drum).
air column|Vibrating air makes sound (flute, pipe).
piston|Moves to push and pull air, creating waves.
object being measured|Quantity compared against a standard unit.
unit rods repeated|Standard unit repeated to measure length.
n₁ × u₁/n₂ × u₂ same quantity|Same quantity = number × unit; bigger unit gives smaller number.
train|Moving frame used to show relative motion.
ball on a smooth floor|Shows motion relative to different observers.
platform ground|Reference frame at rest on the ground.
a|Point of reference or position A.
toy car|Moving object used to study motion.
bus accelerating|Accelerating frame: passengers feel pushed backward.
lift cabin|Accelerating frame that changes apparent weight.
bob on thread|Pendulum: swings back and forth under gravity.
observer test mass|Small mass used to measure the gravitational field.
centre g 0 uniform density model|At Earth's centre the pulls cancel, so g = 0.
flat paper large area|Large area spreads force: low pressure.
crumpled paper small area|Small area concentrates force: high pressure.
hinge|Fixed turning point for a door or lever.
wheel radius r|Big radius needs less force to turn the axle.
axle radius r|Small radius turns with large force.
seconds gear 60 teeth|Gear that turns once per minute.
pinion 10 teeth|Small gear driving a bigger one: speeds up.
minutes gear 60 teeth|Gear turning once per hour.
m₁/m₂|Masses that attract each other by gravity.
spring constant k|Stiffness of the spring: force per unit stretch.
hanging mass|Weight that stretches the spring.
f–x graph area work|Area under the graph is work done.
compressed spring|Stores elastic energy; pushes back when released.
ball on ramp|Gravity speeds the ball down the slope.
point a/point b|Start and end points for measuring displacement.
image seen through the instrument|What you view through a periscope or telescope.
rubber cork sealed system|Seals the flask so no matter enters or leaves.
inner ignition tube|Holds the reactant inside a closed flask.
digital weighing scale|Shows mass before and after to check conservation.
electrostatic deflection plates|Charged plates bend the beam of charged particles.
shared covalent electron pair|Two electrons shared between atoms form a covalent bond.
sodium chloride|Table salt; ionic compound made of Na⁺ and Cl⁻.
`;
const norm=s=>String(s).toLowerCase().replace(/\([^)]*\)/g," $& ").replace(/[^a-z0-9²₂₃₄₆⁴αλ₀-₉½\s]/g," ").replace(/\s+/g," ").trim();
const plain=s=>norm(String(s).replace(/\([^)]*\)/g,""));
const M=new Map();
RAW.split("\n").forEach(l=>{const i=l.indexOf("|");if(i<1)return;const t=l.slice(i+1).trim();l.slice(0,i).split("/").forEach(k=>{const n=norm(k);if(n&&!M.has(n))M.set(n,t)})});
window.VA_FN=name=>{if(!name)return"";return M.get(norm(name))||M.get(plain(name))||M.get(norm(String(name).replace(/[()]/g,"")))||""};
window.VA_FN.size=M.size;
})();
