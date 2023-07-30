import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CartDto } from 'src/dto/cart.dto';
import { QuantityUpdateDto } from 'src/dto/quantityUpdate.dto';
import { SubproductDto } from 'src/dto/subproduct.dto';
import { fillCartEntity } from 'src/helpers/fillCartEntity';
import { removeSubprodFromCart } from 'src/helpers/removeFromCart';
import { updateCartProducts } from 'src/helpers/updateCartProducts';
import { updateCartTotals } from 'src/helpers/updateCartTotals';
import { Cart } from 'src/schemas/cart.schema';
import { Subproduct } from 'src/schemas/subprod.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<Cart>,
    @InjectModel(Subproduct.name)
    private readonly subproductModel: Model<Subproduct>,
  ) {}

  async addToCart(subProduct: SubproductDto, idUser: string): Promise<Cart> {
    const [cartUser, subproductFind] = await Promise.all([
      this.cartModel
        .findOne({ user: new Types.ObjectId(idUser), active: true })
        .lean()
        .exec(),
      this.subproductModel.findById(subProduct._id).exec(),
    ]);

    if (!cartUser) {
      const cartToSave = fillCartEntity(
        subProduct,
        idUser,
        subproductFind,
        this.cartModel,
      );

      const cartSave = await this.cartModel.create(cartToSave);
      const cartSaved = await this.cartModel.findOne({ _id: cartSave._id });
      Logger.log(cartSaved, 'Cart created');

      return cartSaved;
    } else {
      const cartToUpdate: Cart = updateCartProducts(
        cartUser,
        cartUser.subproducts,
        subproductFind,
        subProduct.quantity,
      );

      const cartUpdated: Cart = await this.cartModel.findOneAndUpdate(
        { _id: cartToUpdate._id },
        cartToUpdate,
        { new: true },
      );
      Logger.log(cartUpdated, 'Cart updated');

      return cartUpdated;
    }
  }

  async getUserCart(idUser: string): Promise<Cart> {
    const cartUser = await this.cartModel
      .findOne({ user: new Types.ObjectId(idUser), active: true })
      .exec();

    if (!cartUser) {
      return new Cart();
    } else {
      Logger.log(cartUser, 'Cart');
      return cartUser;
    }
  }

  async addLocalCart(cartData: CartDto, idUser: string): Promise<Cart> {
    const cartUser = await this.cartModel
      .findOne({ user: new Types.ObjectId(idUser), active: true })
      .exec();

    if (!cartUser) {
      cartData.user = new Types.ObjectId(idUser);
      const newCart = new this.cartModel(cartData);
      const cartSaved = await this.cartModel.create(newCart);

      Logger.log(cartSaved, 'Local cart saved');

      return cartSaved;
    } else {
      let userCartUpdated: any;
      for (const elem of cartData.subproducts) {
        const subproduct = await this.subproductModel.findById(elem.subproduct);
        userCartUpdated = updateCartProducts(
          cartUser,
          cartUser.subproducts,
          subproduct,
          elem.quantity,
        );
      }
      const cartUpdated = await this.cartModel.findOneAndUpdate(
        cartUser._id,
        userCartUpdated,
      );
      Logger.log(cartUpdated, 'Local cart updated');

      return cartUpdated;
    }
  }

  async removeFromCart(subprod: SubproductDto, idUser: string): Promise<Cart> {
    const cartDoc = await this.cartModel
      .findOne({ user: new Types.ObjectId(idUser), active: true })
      .exec();

    if (cartDoc) {
      const updatedCart = removeSubprodFromCart(subprod, cartDoc);
      await this.cartModel.findByIdAndUpdate(cartDoc._id, updatedCart);

      Logger.log(updatedCart, 'Removed subprod cart');
      return updatedCart;
    }
  }

  async updateSubprodQuantity(
    subprodQuantity: QuantityUpdateDto,
    idUser: string,
  ): Promise<Cart> {
    const cartFind = await this.cartModel
      .findOne({ user: new Types.ObjectId(idUser), active: true })
      .exec();
    if (cartFind) {
      cartFind.subproducts.forEach((elem) => {
        if (elem.subproduct._id.toString() === subprodQuantity.idSubprod) {
          elem.quantity = subprodQuantity.newQuantity;
        }
      });
      const userCartUpdated = updateCartTotals(cartFind);
      const cartUpdate = await this.cartModel.findByIdAndUpdate(
        cartFind._id,
        userCartUpdated,
      );

      const cartUpdated = await this.cartModel.findOne(cartUpdate._id);
      Logger.log(cartUpdated, 'Cart updated');
      return cartUpdated;
    }
  }

  async getOrderCart(cartId: string): Promise<Cart> {
    const cartDoc: Cart = await this.cartModel.findById(
      new Types.ObjectId(cartId),
    );
    cartDoc.active = false;
    const orderCart = await this.cartModel.findByIdAndUpdate(
      cartDoc._id,
      cartDoc,
    );

    return orderCart;
  }
}
