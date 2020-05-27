import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import moment from 'moment';
// import Config from 'components/config';
import { OrdersProps } from "./typings";
import AccountService from "services/account";
import { currencyCode } from "typings/currency";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { Link } from 'react-router-dom';
import { useStore } from 'react-redux';

const OnlineOrders: React.FC<OrdersProps> = (props) => {
        const [data, setData] = useState([]);
        const [hasShopped, setHasShopped] = useState(false);
        const [isOpenAddressIndex, setIsOpenAddressIndex] = useState(-1);
        const store = useStore();
        const { currency } = store.getState();
        const { dispatch } = store;
    useEffect(() => {
        AccountService.fetchMyOrders(dispatch)
            .then(data => {
                setData(data.results.slice(0,14));
                setHasShopped(data.results.length > 0);
            })
            .then(() => {
                props.hasShopped(hasShopped);
                props.isLoading(false);
                const orderNum = localStorage.getItem("orderNum");
                const orderElem = orderNum && document.getElementById(orderNum);
                if(orderElem){
                    orderElem.scrollIntoView({block: "center",behavior: 'smooth'});
                    localStorage.setItem("orderNum", "");
                }
                localStorage.setItem("orderNum", "");
            })
            .catch((err) => {
                console.error('Axios Error: ', err);
            });
        return () => {
            props.hasShopped(false);
        }
    }, []);

    const showDetails = (index: number) => {
        setIsOpenAddressIndex(index);
    }

    const trackOrder = (e: React.MouseEvent) => {
        localStorage.setItem("orderNum", e.currentTarget.id);
        // props.setAccountPage(e);
    }


    const closeAddress = (data: [], index: number) => {
        let html = [],
            total_item = 0;
        for (let i = 0; i < data.lines.length; i++) {
            total_item += data.lines[i].quantity;
        }
        let isHide ,
            order_data = new Date(data.date_placed),
            today_date = new Date();
        today_date.setMonth(today_date.getMonth() -1);
        // now today date is one month less
        isHide = order_data >= today_date;

        html.push(
            <div className="col-xs-12">
                <div className="add">
                    <address className="order-block">
                        <label>order # {data.number}</label>
                        <div className="row">
                            <div className="col-xs-8">
                                <p>{moment(data.date_placed).format('D MMM,YYYY')}</p>
                                <p><span className="op2"> Status: </span> &nbsp;  <span
                                    className="order-status">{data.status}</span></p>
                                <p><span className="op2"> Items: </span> &nbsp;  {total_item}</p>
                            </div>
                            <div className="col-xs-4">
                                <p><span className="op2">Order Total</span></p>
                                <p className="bold price">{String.fromCharCode(currency_code[data.currency])}&nbsp;{data.total_incl_tax}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-8">
                                <p className="edit-view">
                                    <a className="cerise" onClick={this.showDetails.bind(this,index)} > view </a>
                                </p>
                            </div>
                            <div className="col-xs-4">
                                <p className="edit-track">
                                    {isHide?<a className="cerise" onClick={(e) =>{this.trackOrder(e)}} name='track' id={data.number}> TRACK ORDER </a>:""}
                                </p>
                            </div>
                        </div>


                    </address>
                </div>
            </div>
        )
        return html;
    }

    const closeDetails = () => {
        this.setState({
            isOpenAddressIndex: -1
        })
    }

    const openAddress = (data, index) => {
        let html = [],
            total_item = 0;

        for (let i = 0; i < data.lines.length; i++) {
            total_item += data.lines[i].quantity;
        }
        html.push(
            <div className="col-xs-12">
                <div className="add" id={data.number}>
                    <address>
                        <label>order # {data.number}</label>
                        <div className="row order-block">
                            <div className="col-xs-12 col-md-6">
                                <p>{moment(data.date_placed).format('D MMM,YYYY')}</p>
                                <p><span className="op2">Status</span>: &nbsp;<span
                                    className="order-status">{data.status}</span></p>
                                <p><span className="op2">Items</span>: &nbsp;{total_item}</p>
                            </div>
                            <div className="col-xs-12 col-md-6">
                                <p><span className="op2">Order Total</span></p>
                                <p>{String.fromCharCode(currency_code[data.currency])} &nbsp;{data.total_incl_tax}</p>
                            </div>
                            <p className="edit">
                                <a className="cerise" onClick={this.closeDetails.bind(this,index)}> close </a>
                            </p>
                        </div>
                        <div className="row border-add">
                            <div className="col-xs-12 col-md-6">
                                {data.is_bridal_order ? <div className="add">
                                    {data.shipping_address ? <address>
                                        <label>shipping address</label>
                                        <p>{data.registrant_name}
                                            &nbsp; & &nbsp;{data.co_registrant_name}'s {data.occasion} Registry
                                        </p>
                                        <p className="light"> Address predefined by registrant </p>

                                    </address> : ""}
                                </div> : <div className="add">
                                    {data.shipping_address ? <address>
                                        <label>shipping address</label>
                                        <p>{data.shipping_address.first_name}
                                            &nbsp; {data.shipping_address.last_name}<br /></p>
                                        <p className="light">{data.shipping_address.line1}<br />
                                            {data.shipping_address.line2} {data.shipping_address.line2 && <br />}
                                            {data.shipping_address.state}, {data.shipping_address.postcode} <br />
                                            {data.shipping_address.country_name}<br /></p>
                                        <p> {data.shipping_address.phone_number}</p>

                                    </address> : ""}
                                </div>}
                            </div>
                            <div className="col-xs-12 col-md-6">
                                <div className="add">
                                    {data.billing_address ? <address>
                                        <label>billing address</label>
                                        <p>{data.billing_address.first_name}
                                            &nbsp; {data.billing_address.last_name}<br /></p>
                                        <p className="light">{data.billing_address.line1}<br />
                                            {data.billing_address.line2} {data.billing_address.line2 && <br />}
                                            {data.billing_address.state}, {data.billing_address.postcode} <br />
                                            {data.billing_address.country_name}<br /></p>
                                        <p> {data.billing_address.phone_number}</p>

                                    </address> : ""}
                                </div>
                            </div>
                        </div>
                        {data.lines.map(item=> {
                            return <div className="row voffset4 border-add">
                                <div className="col-xs-5 col-sm-2 col-md-3">
                                    <img
                                        src={item.product.images[0]?item.product.images[0].product_image:""}
                                        className="img-responsive"/>
                                </div>
                                <div className="col-xs-7 col-sm-10 col-md-9">
                                    <div className="image-content text-left">
                                        <p className="product-h item-padding">{item.product.collection}</p>
                                        <p className="product-n item-padding">{item.title}</p>
                                        <p className="product-n item-padding">{String.fromCharCode(currency_code[item.price_currency])}&nbsp; {item.price_incl_tax}</p>
                                        {item.product.size ? <div className="plp_prod_quantity">
                                            Size:&nbsp; {item.product.size}</div> : ""}
                                        <div className="plp_prod_quantity">Qty:&nbsp; {item.quantity}</div>
                                    </div>
                                </div>
                            </div>
                        })}
                        <div className="edit">
                            <a className="cerise" onClick={this.closeDetails.bind(this,index)}> close </a>
                        </div>
                    </address>
                </div>
            </div>
        )
        return html;
    }

    return (
        <div className="online-orders">
            {data.map((data, i) => {
                return <div className="row voffset4">
                    {isOpenAddressIndex == i ? this.openAddress(data, i) : this.closeAddress(data, i)}
                </div>
            })}
        </div>
    )

}

export default OnlineOrders;