import Stripe from "stripe";
import config from "../app/config";

const stripe = new Stripe(config.STRIPE_SECRET as string);

export default stripe;
